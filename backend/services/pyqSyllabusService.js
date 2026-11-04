import { Topic, Unit, Chapter, Subject } from "../models/Curriculum.js";
import {
  CURRICULUM_TOPICS,
  CURRICULUM_UNITS,
  CURRICULUM_CHAPTERS,
  CURRICULUM_SUBJECTS,
} from "../seed/curriculumData.js";

/**
 * Maps an extracted question to the exact Subject → Unit → Chapter → Topic hierarchy.
 * Never invents a topic; strictly draws from existing LearnX curriculum.
 */
export async function mapQuestionToSyllabus(questionText, subjectId) {
  if (!questionText || !subjectId) {
    return {
      unitId: "",
      unitName: "",
      chapterId: "",
      chapterName: "",
      topicId: "",
      topicTitle: "",
      mappingConfidence: 0,
      mappingEvidence: "Missing question text or subject ID",
      verificationStatus: "Needs Review",
      suggestedTopics: [],
    };
  }

  // 1. Fetch all curriculum topics for this subject from DB or seed
  let topics = [];
  let units = [];
  let chapters = [];

  try {
    if (Topic.db?.readyState === 1) {
      topics = await Topic.find({ subjectId }).maxTimeMS(2500).lean();
      units = await Unit.find({ subjectId }).maxTimeMS(2500).lean();
      chapters = await Chapter.find({ subjectId }).maxTimeMS(2500).lean();
    }
  } catch (_) {}

  if (!topics || topics.length === 0) {
    topics = CURRICULUM_TOPICS.filter((t) => t.subjectId === subjectId);
  }
  if (!units || units.length === 0) {
    units = CURRICULUM_UNITS.filter((u) => u.subjectId === subjectId);
  }
  if (!chapters || chapters.length === 0) {
    chapters = CURRICULUM_CHAPTERS.filter((c) => c.subjectId === subjectId);
  }

  const cleanText = questionText.toLowerCase();

  // 2. Score every candidate topic based on keyword, subtopics, and phrase matches
  const scoredTopics = topics.map((top) => {
    let score = 0;
    const evidenceList = [];

    // Exact title match
    const titleClean = top.title.toLowerCase();
    if (cleanText.includes(titleClean)) {
      score += 0.8;
      evidenceList.push(`Exact topic title "${top.title}" found in question`);
    } else {
      // Token overlap of title
      const titleWords = titleClean.split(/[\s,–-]+/).filter((w) => w.length > 3);
      let matchedCount = 0;
      for (const word of titleWords) {
        if (cleanText.includes(word)) {
          matchedCount++;
          score += 0.2;
          evidenceList.push(`Matched keyword "${word}"`);
        }
      }
    }

    // Subtopic matches
    if (Array.isArray(top.subtopics)) {
      for (const sub of top.subtopics) {
        const subClean = sub.toLowerCase();
        if (cleanText.includes(subClean)) {
          score += 0.45;
          evidenceList.push(`Matched subtopic "${sub}"`);
        } else {
          const subWords = subClean.split(/[\s,–-]+/).filter((w) => w.length > 3);
          for (const sw of subWords) {
            if (cleanText.includes(sw)) {
              score += 0.12;
            }
          }
        }
      }
    }

    return {
      topic: top,
      score: Math.min(score, 1.0),
      evidence: evidenceList.join(", "),
    };
  });

  scoredTopics.sort((a, b) => b.score - a.score);

  const best = scoredTopics[0];
  const suggestions = scoredTopics.slice(0, 3).map((st) => {
    const u = units.find((un) => un.unitId === st.topic.unitId);
    return {
      topicId: st.topic.topicId,
      topicTitle: st.topic.title,
      unitId: st.topic.unitId,
      unitName: u?.title || st.topic.unitId,
      confidence: parseFloat(st.score.toFixed(2)),
    };
  });

  if (!best || best.score < 0.25) {
    // If confidence is low, pick closest unit or flag Needs Review
    const fallbackUnit = units[0];
    return {
      unitId: fallbackUnit?.unitId || "u1",
      unitName: fallbackUnit?.title || "Unit 1",
      chapterId: "",
      chapterName: "",
      topicId: "",
      topicTitle: "",
      mappingConfidence: 0.2,
      mappingEvidence: "Low keyword correlation with existing syllabus topics. Marked for manual student review.",
      verificationStatus: "Needs Review",
      suggestedTopics: suggestions,
    };
  }

  const matchedUnit = units.find((u) => u.unitId === best.topic.unitId);
  const matchedChapter = chapters.find((c) => c.chapterId === best.topic.chapterId);

  return {
    unitId: best.topic.unitId,
    unitName: matchedUnit?.title || best.topic.unitId,
    chapterId: best.topic.chapterId || "",
    chapterName: matchedChapter?.title || "",
    topicId: best.topic.topicId,
    topicTitle: best.topic.title,
    subtopics: best.topic.subtopics || [],
    mappingConfidence: parseFloat(best.score.toFixed(2)),
    mappingEvidence: best.evidence || `Correlated with ${best.topic.title}`,
    verificationStatus: best.score >= 0.5 ? "Auto Mapped" : "Needs Review",
    suggestedTopics: suggestions,
  };
}

/**
 * Detects duplicates and semantic similarity across all student PYQ questions
 */
export function computeQuestionSimilarity(qText1, qText2) {
  const normalize = (t) =>
    (t || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const t1 = normalize(qText1);
  const t2 = normalize(qText2);

  if (t1.length === 0 || t2.length === 0) return { isExact: false, score: 0 };

  const s1 = new Set(t1);
  const s2 = new Set(t2);

  const intersection = [...s1].filter((x) => s2.has(x));
  const union = new Set([...s1, ...s2]);

  const jaccard = intersection.length / union.size;

  const isExact = jaccard >= 0.85 || qText1.trim().toLowerCase() === qText2.trim().toLowerCase();
  const isConceptuallySimilar = jaccard >= 0.45 && !isExact;

  return {
    isExact,
    isConceptuallySimilar,
    score: parseFloat(jaccard.toFixed(2)),
  };
}
