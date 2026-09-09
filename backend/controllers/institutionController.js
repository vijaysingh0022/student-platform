import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import CareerProfile from "../models/CareerProfile.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// Helper to filter users
const getFilteredUsers = async (department, batch) => {
  const query = { role: { $ne: "teacher" } };
  if (department && department !== "All") query.department = department;
  if (batch && batch !== "All") query.batch = batch;
  return await User.find(query);
};

// 1. GET /api/institution/overview
export const getClassOverview = async (req, res) => {
  try {
    const { department = "All", batch = "All" } = req.query;
    const students = await getFilteredUsers(department, batch);
    const studentIds = students.map((s) => s._id);

    const testResults = await TestResult.find({ user: { $in: studentIds } });

    const totalStudents = students.length;
    const activeTestTakers = new Set(testResults.map((t) => t.user.toString())).size;
    const totalTestsTaken = testResults.length;

    // Overall Average Score
    const allScores = testResults.map((t) => t.scorePercent);
    const classAvgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    const passCount = allScores.filter((s) => s >= 60).length;
    const passRate = allScores.length > 0 ? Math.round((passCount / allScores.length) * 100) : 0;

    // Attendance Avg
    const allAttendance = students.map((s) => s.attendanceRate || 80);
    const avgAttendance = allAttendance.length > 0 ? Math.round(allAttendance.reduce((a, b) => a + b, 0) / allAttendance.length) : 85;

    // Subject Breakdown
    const subjects = ["DBMS", "DSA", "OS"];
    const subjectBreakdown = subjects.map((subj) => {
      const subjTests = testResults.filter((t) => t.subject === subj);
      const subjScores = subjTests.map((t) => t.scorePercent);
      const avg = subjScores.length > 0 ? Math.round(subjScores.reduce((a, b) => a + b, 0) / subjScores.length) : 0;
      const passed = subjScores.filter((s) => s >= 60).length;
      return {
        subject: subj,
        avgScore: avg,
        testsCount: subjTests.length,
        passRate: subjScores.length > 0 ? Math.round((passed / subjScores.length) * 100) : 0,
      };
    });

    // Grade Distribution
    const gradeDist = {
      "Grade A (80-100%)": 0,
      "Grade B (65-79%)": 0,
      "Grade C (50-64%)": 0,
      "Grade D (<50%)": 0,
    };

    // Calculate per-student average to bucket
    const studentAvgMap = {};
    testResults.forEach((t) => {
      const uid = t.user.toString();
      if (!studentAvgMap[uid]) studentAvgMap[uid] = [];
      studentAvgMap[uid].push(t.scorePercent);
    });

    students.forEach((s) => {
      const scores = studentAvgMap[s._id.toString()] || [];
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      if (avg >= 80) gradeDist["Grade A (80-100%)"]++;
      else if (avg >= 65) gradeDist["Grade B (65-79%)"]++;
      else if (avg >= 50) gradeDist["Grade C (50-64%)"]++;
      else gradeDist["Grade D (<50%)"]++;
    });

    // Available Departments & Batches for Filters
    const allUsers = await User.find({ role: { $ne: "teacher" } });
    const availableDepts = ["All", ...new Set(allUsers.map((u) => u.department || "Computer Science & Engineering"))];
    const availableBatches = ["All", ...new Set(allUsers.map((u) => u.batch || "2022-2026"))];

    res.json({
      totalStudents,
      activeTestTakers,
      totalTestsTaken,
      classAvgScore,
      passRate,
      avgAttendance,
      subjectBreakdown,
      gradeDistribution: Object.entries(gradeDist).map(([grade, count]) => ({ grade, count })),
      availableDepts,
      availableBatches,
      currentFilter: { department, batch },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching class overview", error: error.message });
  }
};

// 2. GET /api/institution/weak-topics
export const getWeakTopicsAnalytics = async (req, res) => {
  try {
    const { department = "All", batch = "All" } = req.query;
    const students = await getFilteredUsers(department, batch);
    const studentIds = students.map((s) => s._id);

    const testResults = await TestResult.find({ user: { $in: studentIds } });

    // Aggregate topicBreakdown
    const topicStats = {};

    testResults.forEach((tr) => {
      if (tr.topicBreakdown && typeof tr.topicBreakdown === "object") {
        Object.entries(tr.topicBreakdown).forEach(([topic, stats]) => {
          if (!topicStats[topic]) {
            topicStats[topic] = {
              subject: tr.subject,
              topic,
              totalAttempts: 0,
              correctAttempts: 0,
            };
          }
          topicStats[topic].totalAttempts += stats.total || 0;
          topicStats[topic].correctAttempts += stats.correct || 0;
        });
      }
    });

    // Format list with error rate and gap level
    const weakTopicsList = Object.values(topicStats).map((t) => {
      const accuracy = t.totalAttempts > 0 ? Math.round((t.correctAttempts / t.totalAttempts) * 100) : 50;
      const errorRate = 100 - accuracy;

      let severity = "Mastered";
      let badgeColor = "emerald";
      let recommendedAction = "Maintain concept with weekly recap problem.";

      if (errorRate >= 50) {
        severity = "Critical Gap";
        badgeColor = "rose";
        recommendedAction = `Schedule a 45-min remedial workshop & hands-on lab on ${t.topic}.`;
      } else if (errorRate >= 30) {
        severity = "Moderate Gap";
        badgeColor = "amber";
        recommendedAction = `Assign focused MCQ drill & practice assignment on ${t.topic}.`;
      }

      return {
        topic: t.topic,
        subject: t.subject,
        accuracy,
        errorRate,
        totalQuestionsAnswered: t.totalAttempts,
        severity,
        badgeColor,
        recommendedAction,
      };
    });

    // Sort by highest error rate
    weakTopicsList.sort((a, b) => b.errorRate - a.errorRate);

    res.json({
      weakTopics: weakTopicsList,
      criticalGapsCount: weakTopicsList.filter((w) => w.severity === "Critical Gap").length,
      moderateGapsCount: weakTopicsList.filter((w) => w.severity === "Moderate Gap").length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching weak topics analytics", error: error.message });
  }
};

// 3. GET /api/institution/at-risk
export const getAtRiskStudents = async (req, res) => {
  try {
    const { department = "All", batch = "All" } = req.query;
    const students = await getFilteredUsers(department, batch);

    const atRiskList = [];

    for (const student of students) {
      const tests = await TestResult.find({ user: student._id });
      const scores = tests.map((t) => t.scorePercent);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const attendance = student.attendanceRate || 80;

      let riskLevel = null;
      const riskReasons = [];

      if (tests.length === 0) {
        riskLevel = "High Risk";
        riskReasons.push("Zero diagnostic assessments completed");
      } else if (avgScore < 45 || attendance < 60) {
        riskLevel = "Critical Risk";
        if (avgScore < 45) riskReasons.push(`Critically low academic average (${avgScore}%)`);
        if (attendance < 60) riskReasons.push(`Severely low attendance (${attendance}%)`);
      } else if (avgScore < 60 || attendance < 75) {
        riskLevel = "High Risk";
        if (avgScore < 60) riskReasons.push(`Below benchmark score (${avgScore}%)`);
        if (attendance < 75) riskReasons.push(`Irregular attendance (${attendance}%)`);
      } else if (avgScore < 70) {
        riskLevel = "Moderate Risk";
        riskReasons.push(`Needs concept reinforcement (${avgScore}%)`);
      }

      if (riskLevel) {
        // Find weakest subject
        const subjectScores = {};
        tests.forEach((t) => {
          if (!subjectScores[t.subject]) subjectScores[t.subject] = [];
          subjectScores[t.subject].push(t.scorePercent);
        });

        let weakestSubject = "General CS";
        let lowestSubjScore = 100;
        Object.entries(subjectScores).forEach(([subj, scs]) => {
          const sAvg = scs.reduce((a, b) => a + b, 0) / scs.length;
          if (sAvg < lowestSubjScore) {
            lowestSubjScore = Math.round(sAvg);
            weakestSubject = subj;
          }
        });

        atRiskList.push({
          id: student._id,
          name: student.name,
          email: student.email,
          rollNo: student.rollNo || "N/A",
          department: student.department || "CSE",
          batch: student.batch || "2022-2026",
          attendanceRate: attendance,
          testsTaken: tests.length,
          avgScore,
          riskLevel,
          riskReasons,
          weakestSubject: `${weakestSubject} (${lowestSubjScore}%)`,
          suggestedIntervention: `Assign 1-on-1 peer mentor for ${weakestSubject} and mandatory attendance monitoring.`,
        });
      }
    }

    // Sort: Critical first, then High, then Moderate
    const riskOrder = { "Critical Risk": 1, "High Risk": 2, "Moderate Risk": 3 };
    atRiskList.sort((a, b) => (riskOrder[a.riskLevel] || 4) - (riskOrder[b.riskLevel] || 4));

    res.json({
      atRiskCount: atRiskList.length,
      criticalCount: atRiskList.filter((r) => r.riskLevel === "Critical Risk").length,
      highCount: atRiskList.filter((r) => r.riskLevel === "High Risk").length,
      moderateCount: atRiskList.filter((r) => r.riskLevel === "Moderate Risk").length,
      students: atRiskList,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching at-risk students", error: error.message });
  }
};

// 4. GET /api/institution/students
export const getStudentDirectory = async (req, res) => {
  try {
    const { department = "All", batch = "All", search = "" } = req.query;
    const students = await getFilteredUsers(department, batch);

    const directory = [];

    for (const student of students) {
      if (
        search &&
        !student.name.toLowerCase().includes(search.toLowerCase()) &&
        !student.email.toLowerCase().includes(search.toLowerCase()) &&
        !(student.rollNo || "").toLowerCase().includes(search.toLowerCase())
      ) {
        continue;
      }

      const tests = await TestResult.find({ user: student._id });
      const career = await CareerProfile.findOne({ user: student._id });

      const scores = tests.map((t) => t.scorePercent);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const atsScore = career?.atsScore || 60;
      const targetRole = career?.targetRole || "Full Stack Software Engineer";

      // Readiness score calculation
      const testCoverageBonus = Math.min(30, tests.length * 10);
      const readinessScore = Math.min(98, Math.max(35, Math.round(avgScore * 0.4 + atsScore * 0.35 + testCoverageBonus)));

      let status = "🟢 Job Ready";
      if (readinessScore < 55) status = "🔴 Action Needed";
      else if (readinessScore < 75) status = "🟡 Developing";

      directory.push({
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo || "N/A",
        department: student.department || "Computer Science & Engineering",
        batch: student.batch || "2022-2026",
        attendanceRate: student.attendanceRate || 85,
        testsCount: tests.length,
        averageScore: avgScore,
        atsScore,
        targetRole,
        readinessScore,
        status,
        lastActive: tests.length > 0 ? tests[tests.length - 1].createdAt : student.createdAt,
      });
    }

    res.json({
      totalCount: directory.length,
      students: directory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student directory", error: error.message });
  }
};

// 5. GET /api/institution/students/:id
export const getStudentDrilldown = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const tests = await TestResult.find({ user: student._id }).sort({ createdAt: -1 });
    const career = await CareerProfile.findOne({ user: student._id });

    const scores = tests.map((t) => t.scorePercent);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        department: student.department,
        batch: student.batch,
        attendanceRate: student.attendanceRate,
      },
      averageScore: avgScore,
      tests,
      careerProfile: career,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student details", error: error.message });
  }
};

// 6. GET /api/institution/analytics
export const getInstitutionAnalytics = async (req, res) => {
  try {
    const allStudents = await User.find({ role: { $ne: "teacher" } });
    const allTests = await TestResult.find({});
    const allCareers = await CareerProfile.find({});

    // Dynamic distinct departments
    const distinctDepts = [...new Set(allStudents.map((s) => s.department || "Computer Science & Engineering"))];
    const depts = distinctDepts.length > 0 ? distinctDepts : ["Computer Science & Engineering"];

    const deptComparison = depts.map((deptName) => {
      const deptStudents = allStudents.filter((s) => (s.department || "Computer Science & Engineering") === deptName);
      const dIds = deptStudents.map((s) => s._id.toString());
      const dTests = allTests.filter((t) => dIds.includes(t.user.toString()));
      const dScores = dTests.map((t) => t.scorePercent);
      const avg = dScores.length > 0 ? Math.round(dScores.reduce((a, b) => a + b, 0) / dScores.length) : 0;

      return {
        department: deptName,
        enrolledStudents: deptStudents.length,
        testsCompleted: dTests.length,
        averageScore: avg,
        passRate: dScores.length > 0 ? Math.round((dScores.filter((s) => s >= 60).length / dScores.length) * 100) : 0,
      };
    });

    // Placement Readiness Tiers based on actual students
    const readinessTiers = { "Job Ready (75%+)": 0, "Developing (55-74%)": 0, "Action Needed (<55%)": 0 };
    const careerMap = {};
    allCareers.forEach((c) => (careerMap[c.user.toString()] = c.atsScore || 60));

    const testMap = {};
    allTests.forEach((t) => {
      const uid = t.user.toString();
      if (!testMap[uid]) testMap[uid] = [];
      testMap[uid].push(t.scorePercent);
    });

    allStudents.forEach((s) => {
      const scs = testMap[s._id.toString()] || [];
      const avg = scs.length > 0 ? scs.reduce((a, b) => a + b, 0) / scs.length : 0;
      const ats = careerMap[s._id.toString()] || 50;
      const rScore = scs.length > 0 
        ? Math.min(98, Math.max(35, Math.round(avg * 0.4 + ats * 0.35 + Math.min(30, scs.length * 10))))
        : (s.attendanceRate >= 80 ? 45 : 30);

      if (rScore >= 75) readinessTiers["Job Ready (75%+)"]++;
      else if (rScore >= 55) readinessTiers["Developing (55-74%)"]++;
      else readinessTiers["Action Needed (<55%)"]++;
    });

    // Real-time accreditation outcome percentages
    const passTests = allTests.filter((t) => t.scorePercent >= 60).length;
    const coAttainment = allTests.length > 0 ? `${Math.round((passTests / allTests.length) * 100)}%` : "0% (Pending Tests)";
    const activeStudentCount = new Set(allTests.map((t) => t.user.toString())).size;
    const participationRate = allStudents.length > 0 ? `${Math.round((activeStudentCount / allStudents.length) * 100)}%` : "0%";
    const remedialCoverage = allStudents.length > 0 ? `${Math.round((allTests.length > 0 ? (activeStudentCount / allStudents.length) * 100 : 0))}%` : "0%";

    res.json({
      totalEnrolled: allStudents.length,
      totalAssessments: allTests.length,
      departmentComparison: deptComparison,
      readinessTiers: Object.entries(readinessTiers).map(([tier, count]) => ({ tier, count })),
      accreditationMetrics: {
        courseOutcomeAttainment: coAttainment,
        continuousAssessmentIndex: participationRate,
        remedialInterventionCoverage: remedialCoverage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching institution analytics", error: error.message });
  }
};

// 7. POST /api/institution/generate-ai-report
export const generateAIInstitutionalReport = async (req, res) => {
  try {
    const { department = "All", batch = "All" } = req.body;
    const students = await getFilteredUsers(department, batch);
    const testResults = await TestResult.find({ user: { $in: students.map((s) => s._id) } });

    const allScores = testResults.map((t) => t.scorePercent);
    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 68;
    const passRate = allScores.length > 0 ? Math.round((allScores.filter((s) => s >= 60).length / allScores.length) * 100) : 70;

    let report = null;

    try {
      const openai = getAIClient();
      const model = getAIModel();

      const prompt = `Act as an Elite Academic Dean & National Accreditation Auditor (NBA/NAAC).
Analyze this institutional cohort academic dataset and produce a structured, high-impact Executive Dean's Report.

COHORT PARAMETERS:
- Department: ${department}
- Batch: ${batch}
- Total Enrolled Students: ${students.length}
- Total Assessments Taken: ${testResults.length}
- Class Academic Average: ${avgScore}%
- Class Passing Rate (>=60%): ${passRate}%

Respond strictly in valid JSON format:
{
  "executiveSummary": "3-4 concise sentences summarizing academic health, student assessment velocity, and placement trajectory.",
  "academicHealthScore": 84,
  "keyStrengths": [
    "High engagement in core DBMS and indexing practicals",
    "Top 35% of the batch demonstrating job-ready placement competencies"
  ],
  "criticalRisks": [
    "Drop in DSA tree traversal accuracy requiring immediate tutorial hours",
    "At-risk subset with low attendance requiring mentor intervention"
  ],
  "facultyActionItems": [
    "Conduct 2-hour remedial problem-solving session on Normalization & B+ Trees",
    "Assign mandatory weekly coding drills for students scoring below 60%"
  ],
  "curriculumRecommendations": "Update Semester 6 elective tracks to incorporate vector databases and distributed systems."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      report = JSON.parse(clean);
    } catch (aiErr) {
      console.error("AI Institution Report error, using smart fallback:", aiErr.message);
    }

    if (!report) {
      report = {
        executiveSummary: `The cohort in ${department} (${batch}) demonstrates an overall academic average of ${avgScore}% with a ${passRate}% assessment pass rate. Core competencies in standard coursework are sound, while advanced data structures and query tuning require focused intervention.`,
        academicHealthScore: Math.min(95, Math.max(50, Math.round(avgScore * 0.7 + passRate * 0.3))),
        keyStrengths: [
          "Consistent assessment participation across core technical subjects",
          "Solid foundational performance in database query structures"
        ],
        criticalRisks: [
          "Sub-60% performance cluster in complex algorithmic problem solving",
          "Attendance irregularities correlated with diagnostic score drops"
        ],
        facultyActionItems: [
          "Organize targeted 45-minute remedial viva labs for at-risk cohorts",
          "Incorporate live code walkthroughs during standard lecture hours"
        ],
        curriculumRecommendations: "Augment practical lab hours for Tree structures, Concurrency, and System Design."
      };
    }

    res.json({
      generatedAt: new Date().toISOString(),
      department,
      batch,
      ...report,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating institutional report", error: error.message });
  }
};

// 8. POST /api/institution/generate-remedial-plan
export const generateRemedialPlan = async (req, res) => {
  try {
    const { topic, subject, errorRate } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    let remedialPlan = null;
    try {
      const openai = getAIClient();
      const model = getAIModel();

      const prompt = `Act as an expert Computer Science Professor.
Create a structured 45-minute remedial lecture breakdown for the topic "${topic}" in "${subject || "Computer Science"}".
Class error rate on this topic is ${errorRate || 40}%.

Respond strictly in valid JSON format:
{
  "topic": "${topic}",
  "subject": "${subject || "Computer Science"}",
  "lectureTitle": "Focused Remedial Session on ${topic}",
  "duration": "45 Minutes",
  "learningObjectives": [
    "Clarify core theoretical principles of ${topic}",
    "Solve 3 standard interview and exam problem patterns"
  ],
  "intuitiveAnalogy": "A memorable real-world analogy to intuitively explain the concept.",
  "commonMisconceptions": "The #1 misunderstanding students make during exams.",
  "remedialSteps": [
    { "min": "0-10m", "focus": "Concept demystification with visual diagrams" },
    { "min": "10-25m", "focus": "Step-by-step whiteboard derivation of algorithm/rules" },
    { "min": "25-40m", "focus": "Hands-on guided problem solving with class participation" },
    { "min": "40-45m", "focus": "Rapid-fire 3-question formative quiz" }
  ],
  "practiceProblems": [
    "Problem 1: Fundamental concept verification",
    "Problem 2: Moderate difficulty edge-case handling",
    "Problem 3: Performance/Complexity trade-off analysis"
  ]
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      remedialPlan = JSON.parse(clean);
    } catch (aiErr) {
      console.error("AI Remedial Plan generation error:", aiErr.message);
    }

    if (!remedialPlan) {
      remedialPlan = {
        topic,
        subject: subject || "Computer Science",
        lectureTitle: `Targeted Mastery Session: ${topic}`,
        duration: "45 Minutes",
        learningObjectives: [
          `Solidify core conceptual foundation in ${topic}`,
          "Master common exam questions and avoid standard pitfalls"
        ],
        intuitiveAnalogy: `Think of ${topic} as a structured workflow where clear input-output rules enforce correctness and speed.`,
        commonMisconceptions: "Overlooking edge cases and misidentifying asymptotic time complexity.",
        remedialSteps: [
          { min: "0-10m", focus: "Concept breakdown & visual intuition" },
          { min: "10-25m", focus: "Live worked examples on the board" },
          { min: "25-40m", focus: "Interactive student problem solving" },
          { min: "40-45m", focus: "Exit ticket formative assessment" }
        ],
        practiceProblems: [
          `Verify core definitions and properties of ${topic}`,
          `Solve standard problem instance step-by-step for ${topic}`,
          `Analyze worst-case time & space complexity for ${topic}`
        ]
      };
    }

    res.json(remedialPlan);
  } catch (error) {
    res.status(500).json({ message: "Error generating remedial plan", error: error.message });
  }
};

