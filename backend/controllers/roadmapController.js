import { getAIClient, getAIModel } from "../config/ai.js";
import Roadmap from "../models/Roadmap.js";
import TestResult from "../models/TestResult.js";
import { recordAuditLog } from "../utils/auditLogger.js";

// Helper to safely extract and parse JSON study plan from LLM response
const parseRoadmapResponse = (content, subject, weakTopics) => {
  if (content && typeof content === "string" && content.trim()) {
    try {
      // 1. Try to extract JSON between outermost curly braces
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(jsonStr);

      const daysArray = parsed.days || parsed.studyPlan || parsed.roadmap?.days || (Array.isArray(parsed) ? parsed : null);

      if (daysArray && Array.isArray(daysArray) && daysArray.length > 0) {
        return {
          overview: parsed.overview || parsed.roadmap?.overview || `Tailored 7-day study path for ${subject} targeting: ${weakTopics.join(", ")}`,
          days: daysArray.map((d, index) => ({
            day: Number(d.day) || index + 1,
            title: d.title || `Day ${index + 1}: ${d.topic || weakTopics[index % weakTopics.length] || subject}`,
            topic: d.topic || weakTopics[index % weakTopics.length] || subject,
            difficulty: d.difficulty || (index < 2 ? "Beginner" : index < 5 ? "Intermediate" : "Advanced"),
            duration: d.duration || "45 mins",
            keyConcepts: Array.isArray(d.keyConcepts) && d.keyConcepts.length > 0 ? d.keyConcepts : [d.topic || `${subject} Core Principles`],
            actionItem: d.actionItem || "Solve 3 targeted conceptual problems and review notes.",
            proTip: d.proTip || "Draw memory diagrams or trace test cases to build intuition.",
            completed: false,
          })),
          planText: content,
        };
      }
    } catch (err) {
      console.warn("Could not parse direct JSON from LLM content, using dynamic curriculum engine:", err.message);
    }
  }

  // Fallback intelligent curriculum generation tailored to subject and weak topics
  const t0 = weakTopics[0] || `${subject} Core Fundamentals`;
  const t1 = weakTopics[1] || weakTopics[0] || `${subject} Architecture`;
  const t2 = weakTopics[2] || weakTopics[0] || `${subject} Problem Solving`;

  const fallbackDays = [
    {
      day: 1,
      title: `Day 1: Foundations of ${t0}`,
      topic: t0,
      difficulty: "Beginner",
      duration: "45 mins",
      keyConcepts: ["Core Definitions & Axioms", "Underlying Architecture", "Common Misconceptions"],
      actionItem: `Read foundational concepts of ${t0} and solve 3 baseline diagnostic problems.`,
      proTip: "Take concise handwritten notes on key definitions; active writing boosts retention by 40%.",
      completed: false,
    },
    {
      day: 2,
      title: `Day 2: Deep Dive into ${t0} Mechanics`,
      topic: t0,
      difficulty: "Intermediate",
      duration: "50 mins",
      keyConcepts: ["Step-by-step Execution", "Time/Space Trade-offs", "Edge Cases"],
      actionItem: `Work through 4 practical examples of ${t0} and trace algorithmic state changes step-by-step.`,
      proTip: "Always dry-run with boundary inputs (empty, single-element, duplicates) before checking solutions.",
      completed: false,
    },
    {
      day: 3,
      title: `Day 3: Hands-on Practice & Edge Cases on ${t0}`,
      topic: t0,
      difficulty: "Intermediate",
      duration: "45 mins",
      keyConcepts: ["Exam Patterns", "Pitfall Avoidance", "Optimal Implementations"],
      actionItem: `Solve 5 past technical interview questions specifically covering ${t0}.`,
      proTip: "Time your problem-solving to simulate exam and interview pressure (under 10 mins per question).",
      completed: false,
    },
    {
      day: 4,
      title: `Day 4: Core Principles of ${t1}`,
      topic: t1,
      difficulty: "Beginner",
      duration: "45 mins",
      keyConcepts: ["Key Mechanics", "Terminology", "Structural Models"],
      actionItem: `Draw structural diagrams and mind-maps explaining ${t1} without looking at reference material.`,
      proTip: "Visual diagrams accelerate spatial recall and make complex technical explanations intuitive.",
      completed: false,
    },
    {
      day: 5,
      title: `Day 5: Advanced Problem Solving & Optimization in ${t1}`,
      topic: t1,
      difficulty: "Advanced",
      duration: "50 mins",
      keyConcepts: ["Performance Optimization", "Comparative Trade-offs", "Real-world Engineering Use"],
      actionItem: `Analyze trade-offs and build a sample implementation comparing optimal vs sub-optimal designs.`,
      proTip: "Interviewers look for 'why' over 'how'—focus on why a particular design or algorithm was chosen.",
      completed: false,
    },
    {
      day: 6,
      title: `Day 6: Integrated Synthesis & Problem Solving (${t2})`,
      topic: t2,
      difficulty: "Advanced",
      duration: "60 mins",
      keyConcepts: ["Cross-topic Integration", "Scenario-based Questions", "System Constraints"],
      actionItem: `Complete a 10-question mixed topic challenge integrating ${weakTopics.join(", ")}.`,
      proTip: "Identify remaining friction points and bookmark questions you spent more than 3 minutes on.",
      completed: false,
    },
    {
      day: 7,
      title: `Day 7: Speed Revision & Final Diagnostic Assessment`,
      topic: `${subject} Mastery`,
      difficulty: "Intermediate",
      duration: "30 mins",
      keyConcepts: ["Formula & Rules Cheat Sheet", "Rapid Recall", "Final Assessment Retake"],
      actionItem: `Retake the ${subject} diagnostic test on LearnX to verify your score improvement!`,
      proTip: "Review your mistake logs from Day 1–6 before starting the final assessment test.",
      completed: false,
    },
  ];

  return {
    overview: `Rigorous 7-day remediation blueprint for ${subject} engineered to turn weak areas (${weakTopics.join(", ")}) into core strengths.`,
    days: fallbackDays,
    planText: content || "Algorithmic study plan generated based on diagnostic test weaknesses.",
  };
};

// @desc Generate an AI personalized study roadmap based on weak topics
// @route POST /api/roadmap/generate
// body: { subject, weakTopics: ["Normalization", "Indexing"] }
export const generateRoadmap = async (req, res) => {
  try {
    const { subject, weakTopics: inputWeakTopics } = req.body;
    const effectiveSubject = subject || "DBMS";

    // 1. Fetch student's latest test result for this subject
    let latestTest = null;
    try {
      if (req.user?._id) {
        latestTest = await TestResult.findOne({
          user: req.user._id,
          subject: effectiveSubject,
        }).sort({ createdAt: -1 });
      }
    } catch (testErr) {
      console.warn("Could not query latest test for roadmap:", testErr.message);
    }

    let calculatedWeakTopics = [];
    let calculatedStrongTopics = [];
    let scorePercent = latestTest?.scorePercent ?? 65;

    if (latestTest && latestTest.topicBreakdown) {
      const topicScores = Object.entries(latestTest.topicBreakdown).map(
        ([topic, data]) => ({
          topic,
          percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        })
      );
      calculatedWeakTopics = topicScores.filter((t) => t.percent < 60).map((t) => t.topic);
      calculatedStrongTopics = topicScores.filter((t) => t.percent >= 60).map((t) => t.topic);
    }

    // Determine final weak topics
    let finalWeakTopics = [];
    if (Array.isArray(inputWeakTopics) && inputWeakTopics.length > 0) {
      finalWeakTopics = inputWeakTopics;
    } else if (calculatedWeakTopics.length > 0) {
      finalWeakTopics = calculatedWeakTopics;
    } else {
      finalWeakTopics = [
        `${effectiveSubject} Core Fundamentals`,
        `${effectiveSubject} Advanced Concepts`,
        "Problem Solving & Edge Cases",
      ];
    }

    const prompt = `You are an elite academic advisor and tutor for a B.Tech Computer Science student.
Subject: ${effectiveSubject}
Student's Recent Test Score: ${scorePercent}%
Diagnosed Critical Weak Topics: ${finalWeakTopics.join(", ")}
${calculatedStrongTopics.length > 0 ? `Mastered Topics: ${calculatedStrongTopics.join(", ")}` : ""}
${latestTest?.aiEvaluation?.aiSummary ? `Examiner Diagnostic Note: ${latestTest.aiEvaluation.aiSummary}` : ""}

Generate a tailored, rigorous, and highly actionable 7-Day Study Roadmap specifically engineered to eliminate the student's weaknesses in ${finalWeakTopics.join(", ")}.

Respond ONLY with a valid JSON object matching this schema:
{
  "overview": "Clear 1-2 sentence high-level learning strategy for the week directly referencing the student's test score and focus areas.",
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
    const candidateModels = [
      getAIModel(),
      "openai/gpt-4o-mini",
      "google/gemini-2.0-flash-001",
      "meta-llama/llama-3.3-70b-instruct",
      "gpt-4o-mini",
    ];

    // Remove duplicates
    const uniqueModels = [...new Set(candidateModels.filter(Boolean))];

    let rawContent = "";
    if (openai && process.env.OPENAI_API_KEY) {
      for (const modelToTry of uniqueModels) {
        try {
          const completion = await openai.chat.completions.create({
            model: modelToTry,
            messages: [
              { role: "system", content: "You are a JSON-only API that outputs structured study plans for engineering students. Always reply with valid JSON only." },
              { role: "user", content: prompt }
            ],
            max_tokens: 1200,
          });
          const content = completion.choices[0]?.message?.content || "";
          if (content.trim()) {
            rawContent = content;
            break;
          }
        } catch (modelErr) {
          console.warn(`Roadmap generation with model ${modelToTry} failed:`, modelErr.message);
        }
      }
    }

    const { overview, days, planText } = parseRoadmapResponse(rawContent, effectiveSubject, finalWeakTopics);

    // Clean up existing roadmap for this subject
    if (req.user?._id) {
      await Roadmap.deleteMany({ user: req.user._id, subject: effectiveSubject }).catch(() => {});
    }

    const roadmap = await Roadmap.create({
      user: req.user._id,
      subject: effectiveSubject,
      weakTopics: finalWeakTopics,
      overview,
      days,
      planText: rawContent || planText,
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error("Roadmap Generation Error:", error.message || error);
    res.status(500).json({ 
      message: error.message || "Failed to generate roadmap." 
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

    recordAuditLog({
      req,
      action: "ROADMAP_DAY_TOGGLED",
      details: {
        subject: roadmap.subject,
        dayNumber,
        completed: day.completed,
      },
    }).catch((aErr) => console.warn("Roadmap audit warning:", aErr.message));

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
