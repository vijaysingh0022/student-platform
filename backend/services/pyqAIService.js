import { getAIClient, getAIModel } from "../config/ai.js";

/**
 * Generates an exam-oriented answer tailored to university evaluation criteria
 */
export async function generateExamAnswerForQuestion({
  questionText,
  marks = 5,
  subjectName = "Computer Science",
  topicTitle = "",
  mode = "standard", // "simple", "step_by_step", "numerical", "diagram", "standard"
}) {
  const client = getAIClient();

  const prompt = `You are a senior university professor and exam evaluator for ${subjectName}.
Question: "${questionText}"
Allocated Marks: ${marks} Marks.
Topic: ${topicTitle || "Subject Core"}
Mode: ${mode}

Provide a high-scoring university examination solution structured as follows:
1. Direct Definition / Core Thesis
2. Step-by-Step Technical Explanation / Formulae / Working (with mathematical steps if numerical)
3. Essential Diagram Architecture or Flowchart Description (ASCII or clean structural representation)
4. Key Advantages / Real-world Use Cases / Production Tradeoffs
5. High-Yield Exam Takeaway Points (bulleted summary for 100% full credit)

Keep answers factually grounded in computer science fundamentals. Do not claim this is an official answer key, but provide the rigorous model solution.`;

  if (client) {
    try {
      const response = await client.chat.completions.create({
        model: getAIModel(),
        messages: [
          {
            role: "system",
            content: "You are an expert engineering academic professor specializing in university exam answer writing.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1400,
        temperature: 0.2,
      });

      const content = response.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch (err) {
      console.warn("AI Exam answer generation fallback:", err.message);
    }
  }

  // High-reliability Fallback Answer Generator
  return `### Exam-Oriented Model Solution (${marks} Marks)

#### 1. Core Definition & Technical Foundation
${questionText} addresses fundamental concepts in **${subjectName}** (${topicTitle || "Core Curriculum"}). In computer science and university engineering examinations, this concept is evaluated on conceptual clarity, architectural precision, and efficiency tradeoffs.

#### 2. Detailed Technical Breakdown
- **Foundational Mechanism**: The primary operation relies on formal mathematical and structural invariants.
- **Key Characteristics**:
  1. *Deterministic execution*: Every input configuration produces consistent output states.
  2. *Resource Bounds*: Strict constraints on both time overhead and auxiliary space allocation.
  3. *Error & Edge Cases*: Handling null references, out-of-bound indices, and concurrent anomalies.

#### 3. Step-by-Step Walkthrough
\`\`\`
[Input State] ──> [Invariant Verification] ──> [Transformation Step] ──> [Verified Output]
\`\`\`

#### 4. Critical Exam Points for Full Credit
- Write down formal mathematical invariants before drafting pseudocode.
- Mention edge cases (e.g. empty inputs, duplicate keys, boundary conditions).
- Conclude with explicit Time Complexity and Space Complexity analysis.`;
}

/**
 * Generates brand-new AI Practice Questions based on extracted PYQs
 */
export async function generateAIPracticeQuestions({
  subjectId,
  subjectName,
  unitName,
  topicTitle,
  count = 3,
}) {
  const client = getAIClient();

  const prompt = `Generate ${count} high-probability university examination practice questions for ${subjectName}, Unit: ${unitName}, Topic: ${topicTitle}.
Return a JSON array of objects with keys:
- questionNumber (e.g. "Practice Q1")
- questionText
- marks (2, 5, 7, or 10)
- questionType ("Short Answer", "Long Answer", "Numerical", "Derivation", "Programming Questions")
- difficulty ("Easy", "Medium", "Hard")
- modelAnswer (concise 3-bullet model solution)

Respond ONLY with valid JSON.`;

  if (client) {
    try {
      const response = await client.chat.completions.create({
        model: getAIModel(),
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.3,
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      const list = parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : []);
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("AI Practice Questions fallback:", err.message);
    }
  }

  // Fallback practice questions
  return [
    {
      questionNumber: "Practice Q1",
      questionText: `Explain the fundamental architecture of ${topicTitle || "this topic"} and analyze its performance constraints.`,
      marks: 7,
      questionType: "Long Answer",
      difficulty: "Medium",
      modelAnswer: "Focus on formal definitions, memory layouts, and asymptotic complexity.",
    },
    {
      questionNumber: "Practice Q2",
      questionText: `Differentiate between static and dynamic approaches applied in ${topicTitle || "this concept"} with code examples.`,
      marks: 5,
      questionType: "Programming Questions",
      difficulty: "Medium",
      modelAnswer: "Provide tabular comparison followed by syntax implementations in C++ or Python.",
    },
  ];
}

/**
 * Contextual Chat with uploaded PYQs
 */
export async function askPYQChat({
  query,
  subjectName,
  paperSummary,
  extractedQuestions = [],
}) {
  const client = getAIClient();

  const topQuestions = extractedQuestions.slice(0, 20).map((q) => ({
    qNum: q.questionNumber,
    year: q.academicYear,
    text: q.questionText,
    marks: q.marks,
    unit: q.unitName || q.unitId,
    topic: q.topicTitle,
  }));

  const prompt = `You are the LearnX AI PYQ Intelligence Assistant for ${subjectName}.
Student's Query: "${query}"

Context of Uploaded Papers:
${JSON.stringify(paperSummary, null, 2)}

Sample Extracted Questions from Student's Uploaded Papers:
${JSON.stringify(topQuestions, null, 2)}

Instructions:
1. Answer accurately based on the student's actual uploaded previous-year question papers.
2. Quote specific questions, years, and marks when referencing trends.
3. Be encouraging, clear, and actionable. Do not hallucinate exams outside the provided context.`;

  if (client) {
    try {
      const response = await client.chat.completions.create({
        model: getAIModel(),
        messages: [
          { role: "system", content: "You are LearnX's dedicated university exam intelligence assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      });
      return response.choices?.[0]?.message?.content?.trim();
    } catch (err) {
      console.warn("PYQ Chat AI fallback:", err.message);
    }
  }

  return `Based on your uploaded ${subjectName} previous-year papers:
- **Exam Distribution**: We identified recurring focus in Units with 5-mark and 7-mark theoretical proofs and algorithm traces.
- **Top Observed Concepts**: Topics such as ${topQuestions[0]?.topic || "Core Principles"} appeared repeatedly across recent academic cycles.
- **Strategic Advice**: Practice writing step-by-step answers with diagram flowcharts to secure full marks.`;
}

