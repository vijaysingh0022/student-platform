import Question from "../models/Question.js";
import TestResult from "../models/TestResult.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// @desc Get questions for a subject (for taking a test)
// @route GET /api/tests/questions/:subject
export const getQuestions = async (req, res) => {
  try {
    const { subject } = req.params;
    // send questions WITHOUT correct answer index (don't leak answers to frontend)
    const questions = await Question.find({ subject }).select("-correctAnswerIndex");
    res.json(questions);
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

    const result = await TestResult.create({
      user: req.user._id,
      subject,
      totalQuestions,
      correctAnswers: correctCount,
      scorePercent,
      topicBreakdown,
      aiEvaluation,
    });

    res.status(201).json(result);
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
