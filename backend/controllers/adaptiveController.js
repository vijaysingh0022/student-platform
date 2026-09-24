import AdaptiveSession from "../models/AdaptiveSession.js";
import TopicProgress from "../models/TopicProgress.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// @desc Start or resume an adaptive practice session
// @route POST /api/adaptive/start
export const startSession = async (req, res) => {
  try {
    const { subjectId, topicId } = req.body;
    const userId = req.user._id;

    let session = await AdaptiveSession.findOne({ user: userId, subjectId, topicId, status: "active" });

    if (!session) {
      session = await AdaptiveSession.create({
        user: userId,
        subjectId,
        topicId,
        currentDifficulty: "easy"
      });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Generate the next question
// @route POST /api/adaptive/next
export const nextQuestion = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await AdaptiveSession.findById(sessionId);

    if (!session || session.status === "completed") {
      return res.status(400).json({ message: "Invalid or completed session." });
    }

    const openai = getAIClient();
    const model = getAIModel();

    const prompt = [
      `You are a strict technical evaluator. Generate ONE multiple-choice question for topic "${session.topicId}" in subject "${session.subjectId}".`,
      `Difficulty: ${session.currentDifficulty}`,
      "Respond ONLY in valid JSON format:",
      '{ "questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..." }'
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const qData = JSON.parse(completion.choices[0].message.content);

    session.attempts.push({
      questionText: qData.questionText,
      options: qData.options,
      correctAnswer: qData.correctAnswer,
      difficulty: session.currentDifficulty,
      mistakePattern: qData.explanation
    });

    await session.save();

    res.status(200).json({
      questionId: session.attempts[session.attempts.length - 1]._id,
      questionText: qData.questionText,
      options: qData.options,
      difficulty: session.currentDifficulty
    });
  } catch (error) {
    console.error("Generate Question Error:", error);
    res.status(500).json({ message: "Failed to generate question" });
  }
};

// @desc Submit answer & adapt difficulty
// @route POST /api/adaptive/submit
export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, timeTakenSeconds } = req.body;
    const session = await AdaptiveSession.findById(sessionId);

    if (!session || session.status === "completed") {
      return res.status(400).json({ message: "Invalid session." });
    }

    const attempt = session.attempts.id(questionId);
    if (!attempt) return res.status(404).json({ message: "Question not found." });

    const isCorrect = attempt.correctAnswer === userAnswer;
    const explanation = attempt.mistakePattern;

    attempt.userAnswer = userAnswer;
    attempt.isCorrect = isCorrect;
    attempt.timeTakenSeconds = timeTakenSeconds;
    attempt.mistakePattern = isCorrect ? "" : "Failed on concept: " + explanation;

    // Difficulty Adjustment Logic
    const recentAttempts = session.attempts.slice(-3);
    const correctRecent = recentAttempts.filter(a => a.isCorrect).length;

    let nextDifficulty = session.currentDifficulty;

    if (recentAttempts.length >= 2) {
      if (correctRecent >= 2) {
        if (nextDifficulty === "easy") nextDifficulty = "medium";
        else if (nextDifficulty === "medium") nextDifficulty = "hard";
        else if (nextDifficulty === "hard") nextDifficulty = "interview";
      } else if (correctRecent === 0) {
        if (nextDifficulty === "interview") nextDifficulty = "hard";
        else if (nextDifficulty === "hard") nextDifficulty = "medium";
        else if (nextDifficulty === "medium") nextDifficulty = "easy";
      }
    }

    session.currentDifficulty = nextDifficulty;
    await session.save();

    res.status(200).json({
      isCorrect,
      correctAnswer: attempt.correctAnswer,
      explanation,
      nextDifficulty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc End session and generate summary
// @route POST /api/adaptive/end
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await AdaptiveSession.findById(sessionId);

    if (!session) return res.status(404).json({ message: "Session not found." });

    const attemptsCount = session.attempts.length;
    if (attemptsCount === 0) {
      session.status = "completed";
      await session.save();
      return res.status(200).json(session);
    }

    const correctCount = session.attempts.filter(a => a.isCorrect).length;
    const totalTime = session.attempts.reduce((sum, a) => sum + (a.timeTakenSeconds || 0), 0);

    session.accuracy = Math.round((correctCount / attemptsCount) * 100);
    session.speedAvgSeconds = Math.round(totalTime / attemptsCount);

    const diffMultiplier =
      session.currentDifficulty === "interview" ? 1 :
      session.currentDifficulty === "hard" ? 0.8 :
      session.currentDifficulty === "medium" ? 0.6 : 0.4;

    session.masteryPercentage = Math.round(session.accuracy * diffMultiplier);

    // Build attempt summary string without template literal nesting
    const attemptLines = session.attempts.map(a => {
      return "- Diff: " + a.difficulty + ", Correct: " + a.isCorrect + ", Time: " + a.timeTakenSeconds + "s, Mistake: " + a.mistakePattern;
    }).join("\n");

    const analysisPrompt = [
      "Analyze this student adaptive practice session for topic: " + session.topicId,
      "Attempts:",
      attemptLines,
      "",
      "Respond ONLY in JSON format:",
      '{ "weakTopics": ["sub-concept"], "mistakePatterns": ["pattern"], "recommendations": ["step 1", "step 2"], "recommendedNextTopic": "topic name" }'
    ].join("\n");

    const openai = getAIClient();
    const model = getAIModel();

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    session.weakTopics = analysis.weakTopics || [];
    session.mistakePatterns = analysis.mistakePatterns || [];
    session.recommendations = analysis.recommendations || [];
    session.recommendedNextTopic = analysis.recommendedNextTopic || "";
    session.status = "completed";

    await session.save();

    // Update TopicProgress
    await TopicProgress.findOneAndUpdate(
      { user: req.user._id, topicId: session.topicId },
      {
        $set: {
          masteryPercentage: session.masteryPercentage,
          masteryStatus: session.masteryPercentage > 80 ? "strong" : session.masteryPercentage > 60 ? "needs_practice" : "weak"
        }
      },
      { upsert: true }
    );

    res.status(200).json({ session });
  } catch (error) {
    console.error("End Session Error:", error);
    res.status(500).json({ message: error.message });
  }
};
