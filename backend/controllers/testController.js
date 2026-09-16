import Question from "../models/Question.js";
import TestResult from "../models/TestResult.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// Fisher-Yates array shuffle helper
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate fresh AI questions for a subject
export const generateFreshQuestionsForSubject = async (subject, count = 10) => {
  try {
    const openai = getAIClient();
    const model = getAIModel();

    const prompt = `You are a Principal Technical Interviewer and Academic Computer Science Examiner.
Generate ${count} completely NEW, diverse, high-quality multiple-choice questions for the subject "${subject}".

Requirements:
1. Cover different core sub-topics within ${subject}.
2. Questions must test practical problem-solving, code execution, architecture, or deep conceptual understanding (similar to GATE / Tier-1 Campus Recruitment Technical OA tests).
3. Ensure every question has 4 plausible, distinct choices.
4. Specify the exact zero-based index (0, 1, 2, or 3) of the correct answer.
5. Provide a realistic topic name for each question.

Respond strictly in valid JSON format:
{
  "questions": [
    {
      "topic": "Topic Name",
      "questionText": "Clear technical question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a JSON-only API that outputs rigorous computer science multiple choice assessment questions." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // High temperature ensures fresh, varied questions on every invocation
    });

    const raw = response.choices[0]?.message?.content || "";
    const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);

    const questionsToSave = [];
    if (parsed && Array.isArray(parsed.questions)) {
      for (const q of parsed.questions) {
        if (q.questionText && Array.isArray(q.options) && q.options.length === 4 && typeof q.correctAnswerIndex === "number") {
          questionsToSave.push({
            subject,
            topic: q.topic || `${subject} Core`,
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
          });
        }
      }
    }

    if (questionsToSave.length > 0) {
      const saved = await Question.insertMany(questionsToSave);
      console.log(`✅ Saved ${saved.length} newly generated AI questions for ${subject}`);
      return saved;
    }
  } catch (err) {
    console.error(`AI Question Generation for ${subject} failed:`, err.message);
  }
  return [];
};

// @desc Generate fresh AI test questions on demand
// @route POST /api/tests/generate-questions
export const generateFreshQuestions = async (req, res) => {
  try {
    const { subject } = req.body;
    const effectiveSubject = subject || "DSA";

    let newQuestions = await generateFreshQuestionsForSubject(effectiveSubject, 10);

    // If AI generation succeeded, return them directly (without correctAnswerIndex)
    if (newQuestions && newQuestions.length > 0) {
      const sanitized = newQuestions.map((q) => {
        const obj = q.toObject ? q.toObject() : { ...q };
        delete obj.correctAnswerIndex;
        return obj;
      });
      return res.status(201).json(sanitized);
    }

    // Fallback: fetch and shuffle existing questions from DB
    const allQuestions = await Question.find({ subject: effectiveSubject }).select("-correctAnswerIndex");
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    res.json(selected);
  } catch (error) {
    console.error("Generate fresh questions error:", error);
    res.status(500).json({ message: error.message || "Failed to generate fresh questions" });
  }
};

// @desc Get questions for a subject (dynamically shuffled and sampled)
// @route GET /api/tests/questions/:subject
export const getQuestions = async (req, res) => {
  try {
    const { subject } = req.params;
    const { refresh } = req.query;

    if (refresh === "true") {
      try {
        await generateFreshQuestionsForSubject(subject, 5);
      } catch (e) {
        console.warn("Refresh generation fallback:", e.message);
      }
    }

    // Fetch all questions for this subject from DB
    let questions = await Question.find({ subject }).select("-correctAnswerIndex");

    // If no questions exist, generate a batch via AI on the fly
    if (!questions || questions.length === 0) {
      await generateFreshQuestionsForSubject(subject, 10);
      questions = await Question.find({ subject }).select("-correctAnswerIndex");
    }

    // Always shuffle questions randomly so each attempt has a completely different order and mix!
    const shuffled = shuffleArray(questions);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    res.json(selected);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit test answers, calculate score + topic-wise skill gap + AI Evaluation
// @route POST /api/tests/submit
// body: { subject, answers: [{ questionId, selectedIndex }] }
export const submitTest = async (req, res) => {
  try {
    const { subject, answers = [] } = req.body;

    // Fetch all questions for this subject to calculate true total & topic breakdown
    let questions = await Question.find({ subject });
    
    // Fallback if no questions matched subject directly
    if (questions.length === 0 && answers.length > 0) {
      const questionIds = answers.map((a) => a.questionId);
      questions = await Question.find({ _id: { $in: questionIds } });
    }

    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions found for this subject" });
    }

    let correctCount = 0;
    const topicBreakdown = {}; // { topic: { correct: n, total: n } }

    for (const question of questions) {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[question.topic].total += 1;

      if (userAnswer && userAnswer.selectedIndex === question.correctAnswerIndex) {
        correctCount += 1;
        topicBreakdown[question.topic].correct += 1;
      }
    }

    const totalQuestions = questions.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // AI Evaluation of Test Submission
    let aiEvaluation = null;
    try {
      const openai = getAIClient();
      const model = getAIModel();

      const prompt = `Act as an expert Academic CS Examiner evaluating a student's test submission.
SUBJECT: ${subject}
SCORE: ${scorePercent}% (${correctCount}/${totalQuestions} questions correct)
TOPIC BREAKDOWN: ${JSON.stringify(topicBreakdown)}

Respond strictly in valid JSON format:
{
  "aiSummary": "2-sentence diagnostic evaluation highlighting key strengths and areas needing improvement.",
  "recommendedFocus": "Specific topic or concept the student should revise next."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      aiEvaluation = JSON.parse(clean);
    } catch (aiErr) {
      console.error("AI Test Evaluation error, using fallback:", aiErr.message);
      aiEvaluation = {
        aiSummary: `You scored ${scorePercent}% on your ${subject} assessment. ${scorePercent >= 70 ? "Great job on core concepts!" : "Focus on reviewing your weak topics to boost mastery."}`,
        recommendedFocus: `${subject} Topic Review`,
      };
    }

    const topicScores = Object.entries(topicBreakdown).map(([topic, data]) => ({
      topic,
      correct: data.correct,
      total: data.total,
      percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    const weakTopics = topicScores.filter((t) => t.percent < 60).map((t) => t.topic);
    const strongTopics = topicScores.filter((t) => t.percent >= 60).map((t) => t.topic);

    const result = await TestResult.create({
      user: req.user._id,
      subject,
      totalQuestions,
      correctAnswers: correctCount,
      scorePercent,
      topicBreakdown,
      aiEvaluation,
    });

    res.status(201).json({
      ...result.toObject(),
      topicScores,
      weakTopics,
      strongTopics,
    });
  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({ message: error.message || "Failed to submit test" });
  }
};

// @desc Get all past results for logged-in student (for dashboard/progress graph)
// @route GET /api/tests/results
export const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get skill gap summary (weak/strong topics) from latest result of a subject
// @route GET /api/tests/skill-gap/:subject
export const getSkillGap = async (req, res) => {
  try {
    const { subject } = req.params;
    const latestResult = await TestResult.findOne({
      user: req.user._id,
      subject,
    }).sort({ createdAt: -1 });

    if (!latestResult) {
      return res.status(404).json({ message: "No test taken yet for this subject" });
    }

    const topicScores = Object.entries(latestResult.topicBreakdown).map(
      ([topic, data]) => ({
        topic,
        percent: Math.round((data.correct / data.total) * 100),
      })
    );

    const weakTopics = topicScores.filter((t) => t.percent < 60).map((t) => t.topic);
    const strongTopics = topicScores.filter((t) => t.percent >= 60).map((t) => t.topic);

    res.json({ topicScores, weakTopics, strongTopics, overallScore: latestResult.scorePercent, aiEvaluation: latestResult.aiEvaluation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
