import { getAIClient, getAIModel } from "../config/ai.js";
import Roadmap from "../models/Roadmap.js";
import TestResult from "../models/TestResult.js";
import TopicProgress from "../models/TopicProgress.js";
import { recordAuditLog } from "../utils/auditLogger.js";

// Standard syllabus curriculum map per subject to ensure comprehensive coverage
const SUBJECT_CURRICULA = {
  DSA: [
    "Array Operations & Memory Layout",
    "Two Pointers & Sliding Window",
    "Linked Lists & Memory Pointers",
    "Stacks & Queues Applications",
    "Binary Trees & Traversal Strategies",
    "BST & Balanced Search Trees",
    "Graph Representation & BFS/DFS",
    "Dijkstra & Shortest Path Algorithms",
    "Heaps & Priority Queues",
    "Dynamic Programming & Memoization",
  ],
  DBMS: [
    "Relational Model & ER Diagrams",
    "SQL Queries & Joins",
    "Functional Dependencies & Normalization (1NF to BCNF)",
    "Indexing & B/B+ Trees",
    "Transaction Processing & ACID Properties",
    "Concurrency Control & Lock-based Protocols",
    "Database Recovery & Crash Log Techniques",
    "NoSQL Databases & Distributed Systems",
  ],
  OS: [
    "Process Management & Control Blocks (PCB)",
    "CPU Scheduling Algorithms (FCFS, SJF, RR)",
    "Process Synchronization & Semaphores",
    "Deadlocks Handling (Banker's Algorithm)",
    "Memory Management & Paging",
    "Virtual Memory & Page Replacement",
    "File Systems Structure & Allocation",
    "I/O Hardware & Disk Scheduling",
  ],
  CN: [
    "OSI & TCP/IP Reference Models",
    "Physical & Data Link Layer (Framing, Error Control)",
    "MAC Protocols & Ethernet CSMA/CD",
    "Network Layer & IP Addressing (IPv4/IPv6, CIDR)",
    "Routing Algorithms (Distance Vector, Link State)",
    "Transport Layer: TCP vs UDP & Congestion Control",
    "Application Layer Protocols (HTTP, DNS, DHCP, FTP)",
    "Network Security & Cryptography Basics",
  ],
  Java: [
    "OOP Principles: Inheritance, Polymorphism, Abstraction",
    "Java Memory Model: Heap, Stack & Garbage Collection",
    "Exception Handling & Custom Exceptions",
    "Java Collections Framework (List, Set, Map)",
    "Multithreading, Concurrency & Synchronization",
    "Java Streams API & Functional Interface Basics",
    "JVM Architecture & Bytecode Execution",
  ],
  Python: [
    "Python Data Structures (Lists, Dicts, Sets, Tuples)",
    "Functional Programming, Lambdas & List Comprehensions",
    "Decorators, Generators & Iterators",
    "OOP in Python & Magic Methods",
    "File I/O, Exception Handling & Context Managers",
    "NumPy & Pandas Data Manipulation Basics",
    "Multiprocessing & AsyncIO in Python",
  ],
  "Web Dev": [
    "HTML5 Semantic Elements & Accessibility (a11y)",
    "CSS Flexbox, Grid & Modern Responsive Layouts",
    "JavaScript ES6+, Promises & Async/Await",
    "DOM Manipulation & Browser Event Loop",
    "React Hooks, Component Lifecycle & State Management",
    "RESTful API Design & Express Server Fundamentals",
    "MongoDB Schema Design & Mongoose ORM",
    "Web Security: CORS, XSS, CSRF & JWT Auth",
  ],
  "System Design": [
    "Client-Server Architecture & Load Balancing",
    "Database Scaling: Sharding, Replication & Federation",
    "Caching Strategies (Redis, Memcached, CDN)",
    "Message Queues & Microservice Decoupling (Kafka, RabbitMQ)",
    "API Gateway & Rate Limiting Algorithms",
    "Consistent Hashing & Distributed Storage",
    "High Availability, Disaster Recovery & SLA Design",
  ],
};

// Format date into YYYY-MM-DD
const formatDate = (dateObj) => {
  const d = new Date(dateObj);
  return d.toISOString().split("T")[0];
};

// Helper to safely parse LLM JSON study plan response
const parseRoadmapResponse = (content, subject, weakTopics, daysRemaining, hoursPerDay) => {
  const defaultDurationMin = Math.min(Math.max(hoursPerDay * 30, 30), 120);

  if (content && typeof content === "string" && content.trim()) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch
        ? jsonMatch[0]
        : content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(jsonStr);

      const daysArray =
        parsed.days || parsed.studyPlan || parsed.roadmap?.days || (Array.isArray(parsed) ? parsed : null);

      if (daysArray && Array.isArray(daysArray) && daysArray.length > 0) {
        return {
          overview:
            parsed.overview ||
            parsed.roadmap?.overview ||
            `Personalized AI Study Planner for ${subject} tailored to your goal & target schedule.`,
          aiRecommendation:
            parsed.aiRecommendation ||
            `AI Recommendation: Complete each daily pipeline (Learn → Practice → Quiz) systematically to boost mastery in weak areas: ${weakTopics.slice(0, 3).join(", ")}.`,
          days: daysArray.map((d, index) => {
            const dateOffset = new Date();
            dateOffset.setDate(dateOffset.getDate() + index);

            return {
              day: Number(d.day) || index + 1,
              date: d.date || formatDate(dateOffset),
              title: d.title || `Day ${index + 1}: ${d.topic || weakTopics[index % weakTopics.length] || subject}`,
              topic: d.topic || weakTopics[index % weakTopics.length] || subject,
              difficulty: d.difficulty || (index < 2 ? "Beginner" : index < 5 ? "Intermediate" : "Advanced"),
              duration: d.duration || `${defaultDurationMin} min`,
              durationMinutes: Number(d.durationMinutes) || parseInt(d.duration) || defaultDurationMin,
              pipeline: Array.isArray(d.pipeline) && d.pipeline.length > 0 ? d.pipeline : ["Learn", "Practice", "Quiz"],
              keyConcepts: Array.isArray(d.keyConcepts) && d.keyConcepts.length > 0 ? d.keyConcepts : [d.topic || `${subject} Core Principles`],
              actionItem: d.actionItem || "Solve 3 targeted conceptual problems and review notes.",
              proTip: d.proTip || "Draw memory diagrams or trace test cases to build intuition.",
              status: d.status || "not-started",
              completed: !!d.completed,
              performanceRating: d.performanceRating || "good",
            };
          }),
          planText: content,
        };
      }
    } catch (err) {
      console.warn("Could not parse direct JSON from LLM content, using dynamic engine:", err.message);
    }
  }

  // Fallback intelligent curriculum generation tailored to subject and weak topics
  const curriculum = SUBJECT_CURRICULA[subject] || SUBJECT_CURRICULA["DSA"];
  const totalDaysToSchedule = Math.min(Math.max(daysRemaining, 5), 14);

  const fallbackDays = [];
  for (let i = 0; i < totalDaysToSchedule; i++) {
    const dateOffset = new Date();
    dateOffset.setDate(dateOffset.getDate() + i);

    let topicName = "";
    if (i < weakTopics.length) {
      topicName = weakTopics[i];
    } else {
      topicName = curriculum[i % curriculum.length];
    }

    const durationMin = Math.min(30 + (i % 3) * 15, hoursPerDay * 60);

    fallbackDays.push({
      day: i + 1,
      date: formatDate(dateOffset),
      title: `Day ${i + 1}: ${topicName}`,
      topic: topicName,
      difficulty: i < 2 ? "Beginner" : i < 5 ? "Intermediate" : "Advanced",
      duration: `${durationMin} min`,
      durationMinutes: durationMin,
      pipeline: ["Learn", "Practice", "Quiz"],
      keyConcepts: [
        `${topicName} Fundamentals & Definitions`,
        "Step-by-step Execution & Complexity",
        "Common Pitfalls & Edge Cases",
      ],
      actionItem: `Read foundational concepts of ${topicName}, complete 3 interactive exercises, and take the mini quiz.`,
      proTip: "Time yourself during practice to simulate exam conditions and build speed under pressure.",
      status: "not-started",
      completed: false,
      performanceRating: "good",
    });
  }

  return {
    overview: `Algorithmic ${totalDaysToSchedule}-Day Study Planner for ${subject} targeting high-yield exam performance and eliminating core weak areas (${weakTopics.join(", ")}).`,
    aiRecommendation: `AI Recommendation: Allocate ${hoursPerDay} hours daily. Focus on completing all 3 stages (Learn → Practice → Quiz) for each day to lock in concept retention.`,
    days: fallbackDays,
    planText: content || "Algorithmic study plan generated from student diagnostic context.",
  };
};

// @desc Generate or update dynamic AI study planner
// @route POST /api/roadmap/generate
// body: { subject, examGoal, examDate, availableHoursPerDay, skillLevel, targetScore, preferredStudyTime }
export const generateRoadmap = async (req, res) => {
  try {
    const {
      subject = "DSA",
      examGoal = "Placement & GATE Preparation",
      examDate,
      availableHoursPerDay = 2,
      skillLevel = "Intermediate",
      targetScore = "90%",
      preferredStudyTime = "Evening",
    } = req.body;

    const userId = req.user._id;

    // 1. Fetch real student mastery profile from TopicProgress and TestResult
    const [topicProgresses, testResults] = await Promise.all([
      TopicProgress.find({ user: userId, subjectId: subject }).lean(),
      TestResult.find({ user: userId, subject }).sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    const weakTopics = [];
    const masteredTopics = [];

    topicProgresses.forEach((tp) => {
      if (tp.masteryPercentage < 60 || tp.masteryStatus === "weak") {
        weakTopics.push(tp.topicId || tp.unitId);
      } else if (tp.masteryPercentage >= 80 || tp.masteryStatus === "mastered" || tp.masteryStatus === "strong") {
        masteredTopics.push(tp.topicId || tp.unitId);
      }
    });

    // Also extract weak topics from latest test result if topicProgresses is sparse
    if (testResults.length > 0 && testResults[0].topicBreakdown) {
      Object.entries(testResults[0].topicBreakdown).forEach(([tName, data]) => {
        const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        if (pct < 60 && !weakTopics.includes(tName)) {
          weakTopics.push(tName);
        } else if (pct >= 80 && !masteredTopics.includes(tName)) {
          masteredTopics.push(tName);
        }
      });
    }

    // Default weak topics fallback if no diagnostic history yet
    const effectiveWeakTopics =
      weakTopics.length > 0
        ? weakTopics
        : (SUBJECT_CURRICULA[subject] || SUBJECT_CURRICULA["DSA"]).slice(0, 3);

    // Calculate days remaining until exam
    let daysRemaining = 14;
    let parsedExamDate = null;
    if (examDate) {
      parsedExamDate = new Date(examDate);
      const diffTime = parsedExamDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (!isNaN(diffDays) && diffDays > 0) {
        daysRemaining = diffDays;
      }
    } else {
      // Default to 14 days from now
      parsedExamDate = new Date();
      parsedExamDate.setDate(parsedExamDate.getDate() + 14);
    }

    const prompt = `You are LearnX's Lead AI Academic Counselor & Dynamic Study Planner.
Target Subject: ${subject}
Exam / Career Goal: ${examGoal}
Target Exam Date: ${parsedExamDate ? parsedExamDate.toISOString().split("T")[0] : "In 2 weeks"} (${daysRemaining} days remaining)
Available Daily Study Time: ${availableHoursPerDay} Hours/day (Preferred Time: ${preferredStudyTime})
Current Skill Level: ${skillLevel}
Target Goal/Score: ${targetScore}

Student Mastery Context:
- Diagnosed Weak Topics: ${effectiveWeakTopics.join(", ")}
- Already Mastered Topics: ${masteredTopics.join(", ") || "None recorded yet"}

Generate a personalized dynamic daily study plan for ${Math.min(daysRemaining, 10)} days.
Each day must contain a learning pipeline: "Learn", "Practice", "Quiz".

Respond ONLY with a valid JSON object matching this schema:
{
  "overview": "Clear 2-sentence executive summary of the dynamic study plan.",
  "aiRecommendation": "Actionable AI recommendation for pacing, exam preparation, and weak topic reinforcement.",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Specific focus topic title",
      "topic": "Topic Name",
      "difficulty": "Beginner | Intermediate | Advanced",
      "duration": "45 min",
      "durationMinutes": 45,
      "pipeline": ["Learn", "Practice", "Quiz"],
      "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "actionItem": "Practical mission (e.g. Learn → Practice 3 problems → Take mini quiz)",
      "proTip": "Actionable exam/interview tip"
    }
  ]
}`;

    const openai = getAIClient();
    const candidateModels = [
      getAIModel(),
      "openai/gpt-4o-mini",
      "google/gemini-2.0-flash-001",
      "meta-llama/llama-3.3-70b-instruct",
      "gpt-4o-mini",
    ];

    const uniqueModels = [...new Set(candidateModels.filter(Boolean))];
    let rawContent = "";

    if (openai && process.env.OPENAI_API_KEY) {
      for (const modelToTry of uniqueModels) {
        try {
          const completion = await openai.chat.completions.create({
            model: modelToTry,
            messages: [
              {
                role: "system",
                content:
                  "You are a JSON-only API that outputs structured dynamic AI study plans for engineering students. Reply with valid JSON only.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 1500,
          });
          const content = completion.choices[0]?.message?.content || "";
          if (content.trim()) {
            rawContent = content;
            break;
          }
        } catch (modelErr) {
          console.warn(`Roadmap model ${modelToTry} error:`, modelErr.message);
        }
      }
    }

    const parsedPlan = parseRoadmapResponse(
      rawContent,
      subject,
      effectiveWeakTopics,
      daysRemaining,
      Number(availableHoursPerDay) || 2
    );

    // Save or update existing roadmap for this subject
    let existingRoadmap = await Roadmap.findOne({ user: userId, subject }).sort({ createdAt: -1 });

    if (existingRoadmap) {
      existingRoadmap.examGoal = examGoal;
      existingRoadmap.examDate = parsedExamDate;
      existingRoadmap.availableHoursPerDay = Number(availableHoursPerDay) || 2;
      existingRoadmap.skillLevel = skillLevel;
      existingRoadmap.targetScore = targetScore;
      existingRoadmap.preferredStudyTime = preferredStudyTime;
      existingRoadmap.weakTopics = effectiveWeakTopics;
      existingRoadmap.masteredTopics = masteredTopics;
      existingRoadmap.overview = parsedPlan.overview;
      existingRoadmap.aiRecommendation = parsedPlan.aiRecommendation;
      existingRoadmap.days = parsedPlan.days;
      existingRoadmap.planText = rawContent || parsedPlan.planText;
      existingRoadmap.lastUpdated = new Date();

      await existingRoadmap.save();
      return res.json(existingRoadmap);
    }

    const newRoadmap = await Roadmap.create({
      user: userId,
      subject,
      examGoal,
      examDate: parsedExamDate,
      availableHoursPerDay: Number(availableHoursPerDay) || 2,
      skillLevel,
      targetScore,
      preferredStudyTime,
      weakTopics: effectiveWeakTopics,
      masteredTopics,
      overview: parsedPlan.overview,
      aiRecommendation: parsedPlan.aiRecommendation,
      days: parsedPlan.days,
      planText: rawContent || parsedPlan.planText,
    });

    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error("Roadmap Generation Error:", error.message || error);
    res.status(500).json({ message: error.message || "Failed to generate dynamic study planner." });
  }
};

// @desc Get active roadmap/study plan for a subject
// @route GET /api/roadmap/:subject
export const getRoadmap = async (req, res) => {
  try {
    const { subject } = req.params;
    let roadmap = await Roadmap.findOne({ user: req.user._id, subject }).sort({
      createdAt: -1,
    });

    if (!roadmap) {
      return res.status(404).json({ message: "No study plan found for this subject." });
    }

    // Auto-migrate legacy roadmaps
    if (!roadmap.days || roadmap.days.length === 0 || !roadmap.days[0].status) {
      const parsed = parseRoadmapResponse(
        roadmap.planText || "",
        roadmap.subject,
        roadmap.weakTopics || [],
        14,
        roadmap.availableHoursPerDay || 2
      );
      roadmap.overview = parsed.overview;
      roadmap.aiRecommendation = parsed.aiRecommendation;
      roadmap.days = parsed.days;
      await roadmap.save();
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update status of a specific study plan day (Start, Pause, Complete, Skip) & dynamically adapt plan
// @route PATCH /api/roadmap/:id/day-status
// body: { dayNumber: 1, status: 'completed' | 'in-progress' | 'paused' | 'skipped', performanceRating: 'poor' | 'good' | 'mastered' }
export const updateDayStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayNumber, status, performanceRating = "good" } = req.body;

    const roadmap = await Roadmap.findOne({ _id: id, user: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    const dayIndex = roadmap.days.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      return res.status(404).json({ message: "Day not found in study plan" });
    }

    const targetDay = roadmap.days[dayIndex];
    targetDay.status = status;
    targetDay.performanceRating = performanceRating;

    if (status === "completed") {
      targetDay.completed = true;
      targetDay.completedAt = new Date();

      // Update student topic progress in DB
      try {
        const topicIdNormalized = targetDay.topic.toLowerCase().replace(/\s+/g, "-");
        await TopicProgress.findOneAndUpdate(
          { user: req.user._id, topicId: topicIdNormalized },
          {
            $set: {
              subjectId: roadmap.subject,
              isCompleted: true,
              completedAt: new Date(),
              masteryStatus: performanceRating === "mastered" ? "mastered" : performanceRating === "poor" ? "weak" : "strong",
              masteryPercentage: performanceRating === "mastered" ? 95 : performanceRating === "poor" ? 45 : 80,
            },
          },
          { upsert: true }
        );
      } catch (tpErr) {
        console.warn("TopicProgress update warning:", tpErr.message);
      }

      // Dynamic AI Rebalancing Rules:
      // 1. If student performed poorly -> Add a targeted revision day for this weak topic
      if (performanceRating === "poor") {
        const revisionDayNum = roadmap.days.length + 1;
        const revisionDate = new Date();
        revisionDate.setDate(revisionDate.getDate() + (revisionDayNum - 1));

        roadmap.days.push({
          day: revisionDayNum,
          date: formatDate(revisionDate),
          title: `Day ${revisionDayNum}: Deep Revision — ${targetDay.topic}`,
          topic: targetDay.topic,
          difficulty: "Intermediate",
          duration: "30 min",
          durationMinutes: 30,
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: [`Targeted Review: ${targetDay.topic}`, "Step-by-step Dry Run", "Pitfall Elimination"],
          actionItem: `Focus review on ${targetDay.topic} due to recent performance score. Solve 3 easy + 2 medium problems.`,
          proTip: "Review your specific mistake patterns before re-attempting the quiz.",
          status: "not-started",
          completed: false,
          performanceRating: "good",
        });

        roadmap.aiRecommendation = `AI Recommendation: Performance on "${targetDay.topic}" indicated need for revision. Automatically appended a 30-min targeted revision day to your study plan.`;
      } 
      // 2. If student mastered topic early -> Update AI recommendation & auto-advance
      else if (performanceRating === "mastered") {
        roadmap.aiRecommendation = `AI Recommendation: 🔥 Excellent mastery on "${targetDay.topic}"! Repetition reduced for this topic; advancing focus to remaining high-yield goals.`;
      } else {
        const remainingCount = roadmap.days.filter((d) => !d.completed && d.status !== "skipped").length;
        roadmap.aiRecommendation = `AI Recommendation: Great progress! Completed Day ${dayNumber} (${targetDay.topic}). ${remainingCount} day(s) remaining in your roadmap.`;
      }
    } else if (status === "skipped") {
      targetDay.completed = false;
      roadmap.aiRecommendation = `AI Recommendation: Skipped Day ${dayNumber} (${targetDay.topic}). Focus allocated to upcoming critical topics.`;
    } else if (status === "in-progress") {
      targetDay.completed = false;
      roadmap.aiRecommendation = `AI Recommendation: Currently focusing on Day ${dayNumber}: ${targetDay.topic} (${targetDay.duration}). Complete all 3 pipeline steps!`;
    } else if (status === "paused") {
      targetDay.completed = false;
      roadmap.aiRecommendation = `AI Recommendation: Day ${dayNumber} study session paused. Resume whenever you're ready to complete your daily goal.`;
    }

    roadmap.lastUpdated = new Date();
    await roadmap.save();

    recordAuditLog({
      req,
      action: "ROADMAP_DAY_STATUS_UPDATED",
      details: {
        subject: roadmap.subject,
        dayNumber,
        status,
        performanceRating,
      },
    }).catch((aErr) => console.warn("Roadmap audit warning:", aErr.message));

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Dynamically reschedule study plan based on missed days / updated exam date
// @route POST /api/roadmap/:id/reschedule
export const rescheduleRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findOne({ _id: id, user: req.user._id });

    if (!roadmap) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    const today = new Date();
    let uncompletedIndex = 0;

    roadmap.days.forEach((day) => {
      if (!day.completed && day.status !== "skipped") {
        const newDate = new Date(today);
        newDate.setDate(today.getDate() + uncompletedIndex);
        day.date = formatDate(newDate);
        day.status = "not-started";
        uncompletedIndex++;
      }
    });

    roadmap.aiRecommendation = `AI Recommendation: 🗓️ Study Plan successfully rescheduled! Remaining ${uncompletedIndex} goals re-indexed starting from today (${formatDate(today)}).`;
    roadmap.lastUpdated = new Date();

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Legacy toggle handler for backward compatibility
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

    const newCompleted = !day.completed;
    day.completed = newCompleted;
    day.status = newCompleted ? "completed" : "not-started";
    if (newCompleted) day.completedAt = new Date();

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
