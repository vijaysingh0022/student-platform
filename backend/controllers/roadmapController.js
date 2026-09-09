import { getAIClient, getAIModel } from "../config/ai.js";
import Roadmap from "../models/Roadmap.js";
import TestResult from "../models/TestResult.js";

// Helper to safely parse JSON study plan from LLM response
const parseRoadmapResponse = (content, subject, weakTopics) => {
  try {
    // Attempt standard JSON parse
    const cleanContent = content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanContent);
    if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
      return {
        overview: parsed.overview || `Focused 7-day study path for ${subject} mastering: ${weakTopics.join(", ")}`,
        days: parsed.days.map((d, index) => ({
          day: d.day || index + 1,
          title: d.title || `Day ${index + 1}: ${d.topic || weakTopics[index % weakTopics.length]}`,
          topic: d.topic || weakTopics[index % weakTopics.length] || subject,
          difficulty: d.difficulty || (index < 2 ? "Beginner" : index < 5 ? "Intermediate" : "Advanced"),
          duration: d.duration || "45 mins",
          keyConcepts: Array.isArray(d.keyConcepts) ? d.keyConcepts : [d.topic || "Core Concepts"],
          actionItem: d.actionItem || "Review concepts and practice sample problems.",
          proTip: d.proTip || "Focus on building clear intuition with diagrams or dry-runs.",
          completed: false,
        })),
        planText: content,
      };
    }
  } catch (err) {
    console.warn("Could not parse direct JSON from LLM, building fallback structure:", err.message);
  }

  // Fallback structure if JSON parse fails
  const fallbackDays = [
    { day: 1, title: `Fundamentals of ${weakTopics[0] || subject}`, topic: weakTopics[0] || subject, difficulty: "Beginner", duration: "40 mins", keyConcepts: ["Core Definitions", "Basic Properties"], actionItem: "Solve 3 conceptual exercises.", proTip: "Take concise notes on definitions." },
    { day: 2, title: `Deep Dive: ${weakTopics[0] || subject}`, topic: weakTopics[0] || subject, difficulty: "Intermediate", duration: "45 mins", keyConcepts: ["Key Mechanics", "Common Pitfalls"], actionItem: "Work through step-by-step examples.", proTip: "Practice tracing algorithms or rules." },
    { day: 3, title: `Practice & Problem Solving`, topic: weakTopics[0] || subject, difficulty: "Intermediate", duration: "50 mins", keyConcepts: ["Exam Patterns", "Edge Cases"], actionItem: "Solve 5 past exam questions.", proTip: "Time yourself to simulate exam pressure." },
    { day: 4, title: `Fundamentals of ${weakTopics[1] || weakTopics[0] || subject}`, topic: weakTopics[1] || weakTopics[0] || subject, difficulty: "Beginner", duration: "40 mins", keyConcepts: ["Architecture", "Key Terminology"], actionItem: "Draw flowcharts or structural diagrams.", proTip: "Visual diagrams accelerate retention." },
    { day: 5, title: `Advanced Analysis: ${weakTopics[1] || weakTopics[0] || subject}`, topic: weakTopics[1] || weakTopics[0] || subject, difficulty: "Advanced", duration: "50 mins", keyConcepts: ["Optimization", "Comparative Analysis"], actionItem: "Analyze trade-offs and best practices.", proTip: "Focus on 'why' behind each technique." },
    { day: 6, title: `Integrated Hands-on Practice`, topic: subject, difficulty: "Advanced", duration: "60 mins", keyConcepts: ["Cross-topic Integration", "Real-world scenarios"], actionItem: "Solve a full mixed mock test module.", proTip: "Identify any remaining friction points." },
    { day: 7, title: `Speed Revision & Self-Assessment`, topic: subject, difficulty: "Intermediate", duration: "30 mins", keyConcepts: ["Formula / Rules Cheat Sheet", "Final Review"], actionItem: "Retake the assessment test on LearnX.", proTip: "Review mistake logs before re-testing." }
  ];

  return {
    overview: `7-day targeted remediation roadmap to strengthen proficiency in ${weakTopics.join(", ")}.`,
    days: fallbackDays,
    planText: content,
  };
};

// @desc Generate an AI personalized study roadmap based on weak topics
// @route POST /api/roadmap/generate
// body: { subject, weakTopics: ["Normalization", "Indexing"] }
export const generateRoadmap = async (req, res) => {
  try {
    const { subject, weakTopics } = req.body;

    if (!weakTopics || weakTopics.length === 0) {
      return res.status(400).json({ message: "No weak topics provided" });
    }

    const prompt = `You are an elite academic advisor and tutor for a B.Tech Computer Science student.
Subject: ${subject}
The student scored low in these specific weak topics: ${weakTopics.join(", ")}.

Generate a rigorous, engaging, and highly actionable 7-Day Study Roadmap specifically targeting these weaknesses.
Respond ONLY with a valid JSON object matching this schema:
{
  "overview": "Clear 1-2 sentence high-level learning strategy for the week.",
  "days": [
    {
      "day": 1,
      "title": "Inspiring, specific topic title",
      "topic": "Topic Name",
      "difficulty": "Beginner | Intermediate | Advanced",
      "duration": "45 mins",
      "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "actionItem": "Specific practical task (e.g. solve 3 specific problems or dry-run a scenario)",
      "proTip": "Actionable insight, common exam pitfall, or memory mnemonic"
    }
  ]
}
Ensure there are exactly 7 distinct, sequential days (day 1 to 7).`;

    const openai = getAIClient();
    const model = getAIModel();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a JSON-only API that outputs structured, high-impact study plans for engineering students." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const rawContent = completion.choices[0].message.content;
    const { overview, days, planText } = parseRoadmapResponse(rawContent, subject, weakTopics);

    // Delete existing roadmap for this subject to replace with latest
    await Roadmap.deleteMany({ user: req.user._id, subject });

    const roadmap = await Roadmap.create({
      user: req.user._id,
      subject,
      weakTopics,
      overview,
      days,
      planText: rawContent || planText,
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error("Roadmap AI Error:", error.message || error);
    res.status(500).json({ 
      message: error.message || "Failed to generate roadmap. Check your OPENAI_API_KEY in .env" 
    });
  }
};

// @desc Get latest roadmap for a subject
// @route GET /api/roadmap/:subject
export const getRoadmap = async (req, res) => {
  try {
    const { subject } = req.params;
    let roadmap = await Roadmap.findOne({ user: req.user._id, subject }).sort({
      createdAt: -1,
    });

    if (!roadmap) {
      return res.status(404).json({ message: "No roadmap generated yet" });
    }

    // Auto-migrate legacy roadmaps that don't have structured days
    if (!roadmap.days || roadmap.days.length === 0) {
      const parsed = parseRoadmapResponse(roadmap.planText || "", roadmap.subject, roadmap.weakTopics || []);
      roadmap.overview = parsed.overview;
      roadmap.days = parsed.days;
      await roadmap.save();
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle a day completion status
// @route PATCH /api/roadmap/:id/toggle-day
// body: { dayNumber: 1 }
export const toggleRoadmapDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayNumber } = req.body;

    const roadmap = await Roadmap.findOne({ _id: id, user: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const day = roadmap.days.find((d) => d.day === dayNumber);
    if (!day) {
      return res.status(404).json({ message: "Day not found in roadmap" });
    }

    day.completed = !day.completed;
    await roadmap.save();

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
