import { CURRICULUM_SUBJECTS, CURRICULUM_UNITS, CURRICULUM_TOPICS } from "../seed/curriculumData.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { normalizeText } from "./pyqExtractionService.js";

/**
 * Maps a single extracted question to the standard LearnX Curriculum:
 * Subject → Unit → Chapter → Topic → Subtopics
 */
export async function mapQuestionToSyllabus(questionText, subjectId) {
  const normQ = normalizeText(questionText);

  // 1. Filter curriculum elements for the given subject
  const subjectTopics = CURRICULUM_TOPICS.filter((t) => t.subjectId === subjectId);
  const subjectUnits = CURRICULUM_UNITS.filter((u) => u.subjectId === subjectId);

  if (subjectTopics.length === 0) {
    // If subject is custom or lacks granular topics, assign default Unit 1
    return {
      unitId: `${subjectId}-u1`,
      unitNumber: 1,
      unitName: "Unit 1: Fundamentals",
      chapterId: null,
      chapterTitle: "",
      topicId: null,
      topicTitle: "Core Concepts",
      subtopics: [],
      mappingConfidence: 0.5,
      mappingEvidence: "Subject curriculum lookup has no granular topics defined.",
      verificationStatus: "Needs Review",
    };
  }

  // 2. Exact keyword / token intersection score
  let bestTopic = null;
  let highestScore = 0;

  for (const topic of subjectTopics) {
    let score = 0;
    const topicNorm = normalizeText(topic.title);
    const subNorms = (topic.subtopics || []).map((s) => normalizeText(s));

    // Title token overlap
    const titleWords = topicNorm.split(" ").filter((w) => w.length > 3);
    for (const tw of titleWords) {
      if (normQ.includes(tw)) score += 3;
    }

    // Subtopics overlap
    for (const sub of subNorms) {
      const subWords = sub.split(" ").filter((w) => w.length > 3);
      for (const sw of subWords) {
        if (normQ.includes(sw)) score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // If local heuristic finds a match (score >= 2)
  if (bestTopic && highestScore >= 2) {
    const unit = subjectUnits.find((u) => u.unitId === bestTopic.unitId);
    return {
      unitId: bestTopic.unitId,
      unitNumber: unit?.unitNumber || 1,
      unitName: unit?.title || `Unit ${unit?.unitNumber || 1}`,
      chapterId: bestTopic.chapterId,
      chapterTitle: "",
      topicId: bestTopic.topicId,
      topicTitle: bestTopic.title,
      subtopics: bestTopic.subtopics || [],
      mappingConfidence: Math.min(0.75 + highestScore * 0.05, 0.98),
      mappingEvidence: `Direct keyword match with topic "${bestTopic.title}" and subtopics.`,
      verificationStatus: "Verified",
    };
  }

  // 3. Fallback to AI Client for intelligent semantic syllabus mapping if score was weak
  // Use Promise.race with a 4s timeout so it never blocks or hangs background processing
  const aiClient = getAIClient();
  if (aiClient) {
    try {
      const prompt = `You are a university engineering curriculum expert.
Map the following exam question to the most appropriate Unit and Topic from this subject's syllabus:

Subject: ${subjectId}
Question: "${questionText}"

Available Syllabus Topics:
${subjectTopics.slice(0, 30).map((t) => `- Topic ID: ${t.topicId} | Title: ${t.title} | Unit: ${t.unitId}`).join("\n")}

Respond ONLY with a JSON object:
{
  "topicId": "matching topicId from above or null",
  "confidence": 0.85,
  "evidence": "brief 1-sentence reason"
}`;

      const aiPromise = aiClient.chat.completions.create({
        model: getAIModel(),
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI mapping timeout")), 4000)
      );

      const res = await Promise.race([aiPromise, timeoutPromise]);

      const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
      if (parsed.topicId) {
        const matched = subjectTopics.find((t) => t.topicId === parsed.topicId);
        if (matched) {
          const unit = subjectUnits.find((u) => u.unitId === matched.unitId);
          return {
            unitId: matched.unitId,
            unitNumber: unit?.unitNumber || 1,
            unitName: unit?.title || `Unit ${unit?.unitNumber || 1}`,
            chapterId: matched.chapterId,
            chapterTitle: "",
            topicId: matched.topicId,
            topicTitle: matched.title,
            subtopics: matched.subtopics || [],
            mappingConfidence: parsed.confidence || 0.82,
            mappingEvidence: parsed.evidence || "Semantic AI syllabus classification.",
            verificationStatus: "Verified",
          };
        }
      }
    } catch (aiErr) {
      console.warn("AI syllabus mapping warning, falling back to top scored:", aiErr.message);
    }
  }

  // Fallback to highest scored or first unit
  const fallbackTopic = bestTopic || subjectTopics[0];
  const unit = subjectUnits.find((u) => u.unitId === fallbackTopic?.unitId);

  return {
    unitId: fallbackTopic?.unitId || `${subjectId}-u1`,
    unitNumber: unit?.unitNumber || 1,
    unitName: unit?.title || "Unit 1",
    chapterId: fallbackTopic?.chapterId || null,
    chapterTitle: "",
    topicId: fallbackTopic?.topicId || null,
    topicTitle: fallbackTopic?.title || "Core Concepts",
    subtopics: fallbackTopic?.subtopics || [],
    mappingConfidence: 0.65,
    mappingEvidence: "Approximate keyword association with syllabus.",
    verificationStatus: "Needs Review",
  };
}

/**
 * Calculates similarity coefficient between two question strings
 */
export function calculateQuestionSimilarity(textA, textB) {
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);

  // Exact Match
  if (normA === normB) {
    return { score: 1.0, type: "Exact Match" };
  }

  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) {
    return { score: 0, type: "Unrelated" };
  }

  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  const jaccard = intersection / union;

  if (jaccard >= 0.7) {
    return { score: Math.round(jaccard * 100) / 100, type: "Modified Variant" };
  }
  if (jaccard >= 0.45) {
    return { score: Math.round(jaccard * 100) / 100, type: "Conceptually Similar" };
  }

  return { score: Math.round(jaccard * 100) / 100, type: "Unrelated" };
}

/**
 * Computes explainable priority score for a question
 */
export function computeQuestionPriority({
  repeatCount = 1,
  marks = 2,
  academicYear = "2023-24",
  topicTitle = "",
}) {
  let score = 30; // base score

  // Appearance frequency bonus
  if (repeatCount > 3) score += 40;
  else if (repeatCount === 3) score += 30;
  else if (repeatCount === 2) score += 20;

  // Marks weightage
  if (marks >= 10) score += 20;
  else if (marks >= 7) score += 15;
  else if (marks >= 5) score += 10;

  // Recency bonus (e.g. 2023-24, 2024, 2022)
  if (academicYear.includes("2024") || academicYear.includes("2023")) {
    score += 10;
  }

  score = Math.min(score, 98);

  let priorityLevel = "Medium Priority";
  let priorityReason = "Standard syllabus concept frequently tested in university examinations.";

  if (score >= 70) {
    priorityLevel = "High Priority";
    priorityReason = `High historical relevance with ${repeatCount > 1 ? `${repeatCount} repeated appearances` : "heavy marks weightage"} across exam sessions.`;
  } else if (score < 45) {
    priorityLevel = "Revision Recommended";
    priorityReason = "Recommended for holistic unit coverage and fundamental review.";
  }

  return { score, priorityLevel, priorityReason };
}

