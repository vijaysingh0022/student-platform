import ExamQuestion from "../models/ExamQuestion.js";
import TopicProgress from "../models/TopicProgress.js";
import ExamMistake from "../models/ExamMistake.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// ============================================================================
// Fallback Expert Knowledge Engine for Exam Copilot
// ============================================================================
const getFallbackCopilotResponse = ({
  action,
  query,
  context = {},
  options = {},
  topicProgress,
}) => {
  const {
    questionText = "Sample Exam Question",
    options: choices = [],
    userAns = "",
    correctAns = "0",
    subjectName = "Computer Science",
    topicName = "Core Concept",
    explanation = "",
    difficulty = "Medium",
  } = context;

  const {
    answerLength = "normal",
    examMarks = 5,
    language = "english",
    hintStep = 1,
  } = options;

  const isHinglish = language === "hinglish";
  const userOptionText = choices[parseInt(userAns, 10)] || userAns || "Your Choice";
  const correctOptionText = choices[parseInt(correctAns, 10)] || correctAns || "Correct Choice";

  switch (action) {
    case "hint": {
      if (hintStep === 1) {
        return {
          type: "hint",
          step: 1,
          totalSteps: 3,
          title: "💡 Clue 1: Directional Hint",
          content: isHinglish
            ? `Pehle basic property recall karo: **${topicName}** mein order aur invariant kaise maintain hota hai? Problem statement ke main condition ko dhyan se padho.`
            : `First recall the governing invariant: How does **${topicName}** maintain structural order? Look closely at the core condition stated in the question.`,
          followUpAction: "Need another hint? Click Hint 2.",
        };
      }
      if (hintStep === 2) {
        return {
          type: "hint",
          step: 2,
          totalSteps: 3,
          title: "💡 Clue 2: Conceptual Rule",
          content: isHinglish
            ? `Ab boundary aur edge-case dekho: Agar hum traverse karein ya elements evaluate karein, toh konse options mathematically ya logically impossible ho jaate hain? Eliminating obvious outliers is key.`
            : `Analyze the boundary condition: Which options violate time complexity, pointer constraints, or structural properties? Eliminate options that cannot logically hold.`,
          followUpAction: "One more step before revealing: Click Hint 3.",
        };
      }
      return {
        type: "hint",
        step: 3,
        totalSteps: 3,
        title: "💡 Clue 3: Application Pointer",
        content: isHinglish
          ? `Direct application: **${topicName}** ke algorithm rule ko apply karo. Agar correct answer compare karein, toh yeh option ${correctOptionText} se match karta hai kyunki ${explanation ? explanation.slice(0, 140) + "..." : "invariant satisfies the requirement"}.`
          : `Direct application: Apply the property of **${topicName}**. The correct option aligns with: ${correctOptionText} because ${explanation ? explanation.slice(0, 140) + "..." : "it directly satisfies the foundational theorem"}.`,
        followUpAction: "Ready to check? You can now reveal full explanation or try answering.",
      };
    }

    case "explain_concept": {
      return {
        type: "concept",
        title: `📖 Core Concept: ${topicName}`,
        sections: [
          {
            heading: "📌 What Is It?",
            body: isHinglish
              ? `**${topicName}** CSE ka ek fundamental concept hai jo university exams mein directly pucha jata hai. Yeh efficient organization, memory allocation, ya execution flow ensure karta hai.`
              : `**${topicName}** is a core Computer Science principle frequently tested in university examinations for data management, algorithmic correctness, and runtime efficiency.`,
          },
          {
            heading: "🎯 Why It Matters in University Exams",
            body: isHinglish
              ? `Professors aksar iske time complexity, properties, aur edge cases pe numericals ya MCQ traps banate hain. ${examMarks} marks ke questions mein iski direct derivation aati hai.`
              : `Examiners evaluate both theoretical derivations and edge cases. In a ${examMarks}-mark question, structuring your answer with standard definitions and asymptotic bounds earns full credit.`,
          },
          {
            heading: "⚠️ Common Exam Trap",
            body: isHinglish
              ? `Students aksar average case aur worst case complexity confuse kar dete hain, ya indexing / pointer base cases bhool jate hain.`
              : `Confusing worst-case guarantees with average-case runtime, or omitting base-case boundary termination in recurrences.`,
          },
          {
            heading: "⚡ Quick Exam Tip",
            body: isHinglish
              ? `Exam mein hamesha standard diagram ya 2-line algorithm definition ke saath answer start karo.`
              : `Always state the asymptotic notation (Big-O) and provide a clean 2-sentence formal definition before diving into steps.`,
          },
        ],
      };
    }

    case "step_by_step": {
      return {
        type: "step_by_step",
        title: `🧩 Step-by-Step Derivation`,
        steps: [
          {
            stepNumber: 1,
            title: "Understand the Problem Statement",
            detail: `Identify given inputs, data constraints, and expected output for: "${questionText.slice(0, 90)}..."`,
          },
          {
            stepNumber: 2,
            title: "Identify Governing Theorem / Invariant",
            detail: `Recall the standard theorem or definition for **${topicName}**. Note any boundary conditions (empty cases, single-element, worst-case).`,
          },
          {
            stepNumber: 3,
            title: "Evaluate Options / Algorithmic Flow",
            detail: explanation
              ? `Applying the core rule: ${explanation}`
              : `Step through the operations systematically. Verify each alternative against the criteria.`,
          },
          {
            stepNumber: 4,
            title: "Verification & Final Deduction",
            detail: `The only alternative satisfying all conditions without contradiction is: **${correctOptionText}**.`,
          },
        ],
        conclusion: `Final Answer: **${correctOptionText}**`,
      };
    }

    case "why_wrong": {
      return {
        type: "why_wrong",
        title: "❌ Deep Mistake Analysis",
        yourAnswer: userOptionText,
        correctAnswer: correctOptionText,
        sections: [
          {
            heading: "🤔 Why Your Answer Looked Reasonable",
            body: isHinglish
              ? `Aapka chuna hua option (**${userOptionText}**) superficial level pe intuitive lagta hai kyunki yeh typical surface-level intuition ya naive assumption se match karta hai.`
              : `Your selection (**${userOptionText}**) is a classic distractor designed to appeal to intuitive heuristics or naive traversal rules.`,
          },
          {
            heading: "⚠️ Where The Misconception Happened",
            body: isHinglish
              ? `Lekin **${topicName}** ke exact rules ke mutabiq, yeh edge-case ya strict invariant ko break karta hai.`
              : `The critical breakdown occurs in handling the boundary invariant or formal definition of **${topicName}**.`,
          },
          {
            heading: "✅ Why The Correct Answer Holds",
            body: explanation || `The correct option (**${correctOptionText}**) preserves formal correctness and standard asymptotic bounds under all test cases.`,
          },
          {
            heading: "💡 University Exam Tip to Remember",
            body: isHinglish
              ? `Agli baar question mein keywords jaise 'strictly', 'worst-case', ya 'all instances' ko double-check karo.`
              : `Flag keywords like "always", "guaranteed", and "minimum" in exam MCQs to avoid falling for boundary distractors.`,
          },
        ],
      };
    }

    case "shortcut": {
      return {
        type: "shortcut",
        title: `⚡ Exam Shortcut & Elimination Technique`,
        techniqueName: `The ${topicName} Elimination Rule`,
        tips: [
          "Eliminate extreme options (e.g. O(1) or O(N!) when typical range is O(N) or O(log N)).",
          "Test with the smallest valid instance (e.g. n = 1, n = 2, or empty structure).",
          "For recurrence relations, use the Master Theorem checklist first before unrolling.",
          "Check dimension compatibility in matrices and graphs before calculating values.",
        ],
        summary: `Applying this shortcut eliminates 2 of the 4 options within 10 seconds in university MCQs.`,
      };
    }

    case "exam_answer": {
      const marks = parseInt(examMarks, 10) || 5;
      return {
        type: "exam_answer",
        marks,
        title: `📝 Model University Answer (${marks} Marks)`,
        structure: [
          {
            section: "1. Formal Definition",
            content: `**${topicName}** is defined as the mathematical and algorithmic methodology for structured computation in ${subjectName}.`,
          },
          {
            section: "2. Key Characteristics & Properties",
            content: `• Property A: Invariant correctness maintained across all states.\n• Property B: Asymptotic upper bound bounded by standard polynomial complexity.\n• Property C: Deterministic termination with finite storage requirements.`,
          },
          ...(marks >= 5
            ? [
                {
                  section: "3. Illustrative Diagram / Logic Flow",
                  content: `[ Input ] ──> [ Process Invariant: ${topicName} ] ──> [ Verified State / Optimal Output ]`,
                },
              ]
            : []),
          ...(marks >= 10
            ? [
                {
                  section: "4. Numerical Example / Pseudo-code",
                  content: `Algorithm Process(${topicName}):\n  1. Initialize state S\n  2. While conditions hold, advance invariant\n  3. Return verified optimal state`,
                },
                {
                  section: "5. Asymptotic & Comparative Analysis",
                  content: `• Time Complexity: O(log N) optimal, O(N) linear scan.\n• Space Complexity: O(1) auxiliary auxiliary space.\n• Real-world Application: Used in high-throughput database engines and OS schedulers.`,
                },
              ]
            : []),
          {
            section: "Conclusion",
            content: `Hence, **${topicName}** provides guaranteed structural invariants essential for university evaluation.`,
          },
        ],
      };
    }

    case "revision_notes": {
      return {
        type: "revision_notes",
        title: `📝 High-Yield Revision Note: ${topicName}`,
        definition: `Core operational paradigm in ${subjectName} governing structured state execution.`,
        keyPoints: [
          "Primary Invariant: Consistent state maintenance.",
          "Worst-Case Complexity: Bounded by standard Big-O limits.",
          "Common Examiner Question: Prove correctness or trace traversal sequence.",
        ],
        keyFormula: explanation.includes("O(") ? explanation.match(/O\([^)]+\)/)?.[0] || "O(log N)" : "O(N log N)",
        examTip: "Highlight time-complexity and draw the state progression diagram in 5-mark and 10-mark questions.",
        canSave: true,
      };
    }

    case "similar_question": {
      return {
        type: "similar_question",
        title: `🎯 Similar Practice Question on ${topicName}`,
        questionText: `In ${subjectName}, which of the following statements is ALWAYS TRUE regarding ${topicName}?`,
        options: [
          `The operations maintain the core invariant in both average and worst cases.`,
          `Space complexity is always unbounded regardless of input size.`,
          `It cannot be implemented using standard sequential memory structures.`,
          `Recursive implementations always guarantee O(1) stack frames.`,
        ],
        correctAnswer: "0",
        explanation: `Statement A is correct because formal algorithms in ${topicName} guarantee state correctness across well-defined operating boundaries.`,
        difficulty: difficulty || "Medium",
        marks: 5,
      };
    }

    case "mini_quiz": {
      return {
        type: "mini_quiz",
        title: `🧠 3-Question Topic Check: ${topicName}`,
        questions: [
          {
            qIndex: 0,
            text: `What is the primary objective of ${topicName} in ${subjectName}?`,
            options: [
              "Optimizing memory and algorithmic efficiency",
              "Bypassing hardware safety constraints",
              "Allowing unbounded recursive calls",
              "Removing all runtime type validations",
            ],
            correctAns: "0",
            explanation: `${topicName} provides structured runtime and memory guarantees.`,
          },
          {
            qIndex: 1,
            text: `Which time complexity is typically associated with standard operations on ${topicName}?`,
            options: ["O(log N) or O(N)", "O(N!)", "O(2^N)", "O(N^3)"],
            correctAns: "0",
            explanation: "Core operations in computer science curricula are designed to operate in polynomial or logarithmic time.",
          },
          {
            qIndex: 2,
            text: `In a university examination, what is the best strategy when answering questions on ${topicName}?`,
            options: [
              "Provide definition, standard diagram, and Big-O bounds",
              "Only write the final answer without steps",
              "Omit base cases in explanations",
              "Rely purely on high-level pseudocode without rationale",
            ],
            correctAns: "0",
            explanation: "Examiners award maximum marks for clear definitions, diagrams, and asymptotic analysis.",
          },
        ],
      };
    }

    default: {
      return {
        type: "general",
        title: `🤖 LearnX AI Exam Copilot`,
        content: isHinglish
          ? `**${topicName}** ke baare mein aapka sawal: "${query || "Explanation"}".\n\nIs question ko solve karne ke liye, core invariant ko apply karein. Correct option **${correctOptionText}** hai kyunki ${explanation || "it follows standard computer science definitions"}.`
          : `Regarding your query on **${topicName}**: "${query || "Explanation"}".\n\nTo solve this question, examine the core invariant carefully. The solution resolves to **${correctOptionText}** because ${explanation || "it adheres strictly to foundational computing principles"}.`,
      };
    }
  }
};

// ============================================================================
// @route POST /api/exam-prep/copilot/ask
// ============================================================================
export const askExamCopilot = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { action = "explain_concept", query = "", context = {}, options = {} } = req.body;

    const {
      questionId = "",
      questionText = "",
      options: choices = [],
      userAns = "",
      correctAns = "",
      subjectId = "dsa",
      subjectName = "Data Structures & Algorithms",
      topicId = "general",
      topicName = "Core Concept",
      explanation = "",
      difficulty = "Medium",
    } = context;

    const {
      answerLength = "normal",
      examMarks = 5,
      language = "english",
      hintStep = 1,
    } = options;

    // 1. Fetch Student Context if logged in
    let topicProgress = null;
    let mistakeRecord = null;
    if (userId && topicId) {
      try {
        [topicProgress, mistakeRecord] = await Promise.all([
          TopicProgress.findOne({ user: userId, topicId }).lean().catch(() => null),
          questionId ? ExamMistake.findOne({ user: userId, questionId }).lean().catch(() => null) : null,
        ]);
      } catch (err) {
        console.warn("Copilot user context fetch warning:", err?.message);
      }
    }

    const studentContextNotes = [];
    if (topicProgress) {
      studentContextNotes.push(
        `Current Student Topic Mastery: ${topicProgress.masteryPercentage || 0}% (${topicProgress.masteryStatus || "learning"}), Attempts: ${topicProgress.attemptsCount || 0}`
      );
    }
    if (mistakeRecord) {
      studentContextNotes.push(`Student previously missed this exact question (${mistakeRecord.attemptsCount || 1} times).`);
    }

    // 2. If AI is configured, attempt LLM call
    const aiClient = getAIClient();
    if (aiClient && process.env.OPENAI_API_KEY) {
      try {
        const isHinglish = language === "hinglish";
        const systemPrompt = `You are "LearnX AI Exam Copilot", an elite, patient university Computer Science exam tutor.
You are embedded directly in the student's exam preparation view.
Student Context: ${studentContextNotes.join(" | ") || "Undergraduate CSE Student"}.
Subject: ${subjectName} | Topic: ${topicName} | Difficulty: ${difficulty}.
Question: "${questionText}"
Choices: ${JSON.stringify(choices)}
Student Selected Answer: "${userAns}" (Option index or text)
Correct Answer: "${correctAns}" (Option index or text)
Reference Explanation: "${explanation}"

Language Mode: ${isHinglish ? "Natural, clear Hinglish (Hindi + English) as spoken in Indian engineering colleges. Never translate technical terms incorrectly." : "Clear, professional, academic English with precise CSE terminology."}
Answer Length: ${answerLength} (short: 2-3 sentences; normal: structured cards; detailed: in-depth with diagrams/derivations).

CRITICAL INSTRUCTIONS:
- For action "hint": DO NOT reveal the final answer. Provide step ${hintStep} of 3 progressive hints.
- For action "why_wrong": Contrast student's answer vs correct answer, explain the cognitive trap, and provide an exam tip.
- For action "step_by_step": Provide 4-5 numbered derivation steps.
- For action "exam_answer": Structure exactly as a ${examMarks}-mark university model answer.
- For action "shortcut": Provide an elimination or memory trick.
- For action "similar_question": Return a JSON object with questionText, options (array of 4), correctAnswer (index "0"-"3"), explanation, difficulty.
- For action "mini_quiz": Return a JSON object with questions array (3 questions with text, options, correctAns, explanation).
- Return valid JSON matching the required action response.`;

        const userPrompt = `Action: ${action}. Additional Student Query: "${query}". Hint Step: ${hintStep}. Please provide your structured response.`;

        const completion = await aiClient.chat.completions.create({
          model: getAIModel(),
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: answerLength === "short" ? 400 : 1200,
        });

        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          return res.json({
            success: true,
            source: "ai",
            data: parsed,
            meta: {
              action,
              topicName,
              masteryPercentage: topicProgress?.masteryPercentage || 0,
            },
          });
        }
      } catch (llmErr) {
        console.warn("Copilot LLM fallback triggered:", llmErr?.message);
      }
    }

    // 3. Robust Expert Fallback Engine
    const fallbackData = getFallbackCopilotResponse({
      action,
      query,
      context,
      options,
      topicProgress,
    });

    return res.json({
      success: true,
      source: "calibrated_engine",
      data: fallbackData,
      meta: {
        action,
        topicName,
        masteryPercentage: topicProgress?.masteryPercentage || 0,
      },
    });
  } catch (err) {
    console.error("askExamCopilot error:", err);
    res.status(500).json({ message: "AI Exam Copilot temporarily unavailable.", error: err.message });
  }
};

// ============================================================================
// @route GET /api/exam-prep/copilot/mistake-book
// ============================================================================
export const getMistakeBook = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const mistakes = await ExamMistake.find({ user: userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: mistakes.length,
      mistakes,
    });
  } catch (err) {
    console.error("getMistakeBook error:", err);
    res.status(500).json({ message: "Failed to fetch Mistake Book." });
  }
};

// ============================================================================
// @route POST /api/exam-prep/copilot/mistake-book
// ============================================================================
export const toggleMistakeBookItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const {
      questionId,
      questionText,
      options = [],
      subjectId = "dsa",
      subjectName = "Data Structures",
      unitName = "",
      topicId = "general",
      topicName = "General Concept",
      userAns = "",
      correctAns = "",
      explanation = "",
      action = "add", // 'add' | 'remove' | 'resolve'
    } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: "questionId is required." });
    }

    if (action === "remove") {
      await ExamMistake.deleteOne({ user: userId, questionId });
      return res.json({ success: true, message: "Removed from Mistake Book.", inMistakeBook: false });
    }

    if (action === "resolve") {
      const updated = await ExamMistake.findOneAndUpdate(
        { user: userId, questionId },
        { status: "resolved" },
        { new: true }
      );
      return res.json({ success: true, message: "Marked as resolved! 🎉", item: updated });
    }

    // Default: Add or update
    const mistake = await ExamMistake.findOneAndUpdate(
      { user: userId, questionId },
      {
        questionText: questionText || "Exam Question",
        options,
        subjectId,
        subjectName,
        unitName,
        topicId,
        topicName,
        userAns,
        correctAns,
        explanation,
        status: "unresolved",
        $inc: { attemptsCount: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: "Saved to your Personal Mistake Book! 🔖",
      inMistakeBook: true,
      item: mistake,
    });
  } catch (err) {
    console.error("toggleMistakeBookItem error:", err);
    res.status(500).json({ message: "Failed to update Mistake Book." });
  }
};

// ============================================================================
// @route POST /api/exam-prep/copilot/evaluate-similar
// ============================================================================
export const evaluateSimilarQuestion = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { topicId, topicName, subjectId, userAns, correctAns, explanation } = req.body;

    const isCorrect = String(userAns).trim() === String(correctAns).trim();

    // If student answered correctly, update TopicProgress mastery
    let updatedProgress = null;
    if (userId && topicId) {
      try {
        const delta = isCorrect ? 8 : -3;
        const existing = await TopicProgress.findOne({ user: userId, topicId });
        if (existing) {
          const newMastery = Math.min(100, Math.max(0, (existing.masteryPercentage || 50) + delta));
          existing.masteryPercentage = newMastery;
          existing.masteryStatus = newMastery >= 75 ? "strong" : newMastery >= 50 ? "needs_practice" : "weak";
          existing.attemptsCount = (existing.attemptsCount || 0) + 1;
          await existing.save();
          updatedProgress = existing;
        } else {
          updatedProgress = await TopicProgress.create({
            user: userId,
            topicId,
            subjectId: subjectId || "dsa",
            masteryPercentage: isCorrect ? 60 : 40,
            masteryStatus: isCorrect ? "needs_practice" : "weak",
            attemptsCount: 1,
            isCompleted: isCorrect,
          });
        }
      } catch (progErr) {
        console.warn("TopicProgress update notice:", progErr?.message);
      }
    }

    res.json({
      success: true,
      isCorrect,
      message: isCorrect
        ? "Excellent job! You correctly solved this similar practice question. Your Topic Mastery has increased! 🚀"
        : "Not quite, but good attempt! Review the explanation and try another question to master this concept.",
      explanation: explanation || "Refer to the foundational theorem and invariant rules.",
      masteryUpdate: updatedProgress
        ? {
            masteryPercentage: updatedProgress.masteryPercentage,
            masteryStatus: updatedProgress.masteryStatus,
          }
        : null,
    });
  } catch (err) {
    console.error("evaluateSimilarQuestion error:", err);
    res.status(500).json({ message: "Failed to evaluate similar question." });
  }
};
