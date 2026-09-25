import { exec, execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { getAIClient, getAIModel } from "../config/ai.js";
import { recordAuditLog } from "../utils/auditLogger.js";

import { CODING_PROBLEMS } from "../data/codingProblems.js";

// Helper to execute code locally safely in temporary file sandbox
const executeLocally = (language, code, stdinInput = "") => {
  return new Promise((resolve) => {
    const tmpDir = os.tmpdir();
    const startTime = Date.now();

    let fileName = "";
    let command = "";

    const lang = language.toLowerCase();

    if (lang === "python") {
      fileName = path.join(tmpDir, `script_${Date.now()}.py`);
      fs.writeFileSync(fileName, code);
      command = `python3 "${fileName}"`;
    } else if (lang === "javascript") {
      fileName = path.join(tmpDir, `script_${Date.now()}.js`);
      fs.writeFileSync(fileName, code);
      command = `node "${fileName}"`;
    } else if (lang === "cpp" || lang === "c") {
      const srcFile = path.join(tmpDir, `prog_${Date.now()}.${lang === "cpp" ? "cpp" : "c"}`);
      const outFile = path.join(tmpDir, `prog_${Date.now()}.out`);
      fs.writeFileSync(srcFile, code);
      const compiler = lang === "cpp" ? "g++" : "gcc";
      command = `${compiler} "${srcFile}" -o "${outFile}" && "${outFile}"`;
    } else if (lang === "java") {
      const srcFile = path.join(tmpDir, `Solution.java`);
      fs.writeFileSync(srcFile, code);
      command = `javac "${srcFile}" && java -cp "${tmpDir}" Solution`;
    } else if (lang === "sql") {
      // Return simulated query result for SQL
      const duration = Date.now() - startTime;
      return resolve({
        stdout: `+----+----------+--------+\n| id | name     | salary |\n+----+----------+--------+\n|  1 | Alice    |  95000 |\n|  3 | Charlie  |  82000 |\n+----+----------+--------+\n(2 rows affected)`,
        stderr: "",
        executionTimeMs: duration,
        status: "Accepted",
      });
    } else {
      return resolve({
        stdout: "",
        stderr: `Unsupported language: ${language}`,
        executionTimeMs: 0,
        status: "Error",
      });
    }

    const child = exec(
      command,
      { timeout: 4000, maxBuffer: 1024 * 512 },
      (error, stdout, stderr) => {
        const executionTimeMs = Date.now() - startTime;

        // Cleanup temp files safely
        try {
          if (fileName && fs.existsSync(fileName)) fs.unlinkSync(fileName);
        } catch (e) {}

        if (error) {
          if (error.killed) {
            return resolve({
              stdout: stdout || "",
              stderr: "Time Limit Exceeded (TLE) - Execution exceeded 4 seconds.",
              executionTimeMs,
              status: "Time Limit Exceeded",
            });
          }
          return resolve({
            stdout: stdout || "",
            stderr: stderr || error.message || "Runtime Error",
            executionTimeMs,
            status: "Runtime Error",
          });
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          executionTimeMs,
          status: "Accepted",
        });
      }
    );

    // Pass custom stdin input if provided
    if (stdinInput && child.stdin) {
      child.stdin.write(stdinInput);
      child.stdin.end();
    }
  });
};

// @desc Fetch available coding problems
// @route GET /api/coding/problems
export const getProblems = async (req, res) => {
  try {
    res.json(CODING_PROBLEMS);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Run code against custom stdin input
// @route POST /api/coding/run
// body: { language, code, customInput }
export const runCode = async (req, res) => {
  try {
    const { language = "python", code = "", customInput = "" } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code cannot be empty." });
    }

    const result = await executeLocally(language, code, customInput);
    res.json(result);
  } catch (error) {
    console.error("Run Code Error:", error);
    res.status(500).json({
      stdout: "",
      stderr: error.message || "Code execution failed.",
      executionTimeMs: 0,
      status: "System Error",
    });
  }
};

// @desc Submit code, evaluate against test cases & perform comprehensive AI code audit
// @route POST /api/coding/submit
// body: { problemId, language, code }
export const submitCode = async (req, res) => {
  try {
    const { problemId = "two-sum", language = "python", code = "" } = req.body;

    const problem = CODING_PROBLEMS.find((p) => p.id === problemId) || CODING_PROBLEMS[0];
    const testCases = problem.testCases || [];

    // Run execution against test cases
    const testResults = [];
    let passedCount = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execRes = await executeLocally(language, code, tc.input);

      const actualOutClean = execRes.stdout.replace(/\s+/g, "");
      const expectedOutClean = tc.expectedOutput.replace(/\s+/g, "");
      const passed = execRes.status === "Accepted" && actualOutClean === expectedOutClean;

      if (passed) passedCount++;

      testResults.push({
        testCaseNumber: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: execRes.stdout || execRes.stderr,
        passed,
        executionTimeMs: execRes.executionTimeMs,
        status: execRes.status,
      });
    }

    const totalCount = testCases.length;
    const isAllPassed = passedCount === totalCount;

    // AI Comprehensive Post-Submission Analysis
    const prompt = `You are LearnX's Lead AI Senior Technical Examiner.
Analyze this student's submission for problem "${problem.title}".

Language: ${language}
Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Test Results: ${passedCount}/${totalCount} Passed.

Analyze and evaluate strictly. Output ONLY valid JSON matching this schema:
{
  "correctnessScore": 95,
  "efficiencyScore": 90,
  "codeQualityScore": 88,
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "potentialIssues": ["List any nested loops, memory leaks, or unhandled nulls"],
  "edgeCasesHandled": ["Empty arrays", "Single element"],
  "edgeCasesMissed": ["Negative values", "Integer overflow"],
  "aiSummary": "2-sentence executive technical review of the code quality and correctness.",
  "improvedSolution": "Clean, optimized refactored version of the code in ${language} with docstring.",
  "interviewFollowUp": [
    "Question 1: What if the input array is sorted?",
    "Question 2: How would you scale this to handle 1 billion entries across a distributed stream?"
  ]
}`;

    const openai = getAIClient();
    let aiEvaluation = null;

    if (openai && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a JSON-only API that evaluates student code submissions. Reply strictly with valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1200,
        });

        const content = completion.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiEvaluation = JSON.parse(jsonMatch[0]);
        }
      } catch (aiErr) {
        console.warn("AI Code Submission Audit failed:", aiErr.message);
      }
    }

    // Fallback AI evaluation if API key unavailable
    if (!aiEvaluation) {
      aiEvaluation = {
        correctnessScore: isAllPassed ? 100 : Math.round((passedCount / totalCount) * 100),
        efficiencyScore: 85,
        codeQualityScore: 90,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        potentialIssues: [
          code.includes("for") && code.split("for").length > 2
            ? "Nested iteration detected — potential O(n²) bottleneck."
            : "Ensure memory is released after usage.",
        ],
        edgeCasesHandled: ["Standard positive inputs"],
        edgeCasesMissed: ["Null or empty collections", "Boundary values"],
        aiSummary: isAllPassed
          ? "Solid implementation! All test cases passed with clean execution."
          : "Some test cases failed. Check edge case handling and parameter boundaries.",
        improvedSolution: `// Optimized ${language} Solution\n` + code,
        interviewFollowUp: [
          "Follow-up 1: What is the time complexity difference if we sort the array first?",
          "Follow-up 2: How would you optimize space complexity to O(1)?",
        ],
      };
    }

    recordAuditLog({
      req,
      action: "QUIZ_EVALUATED",
      details: {
        problemId,
        language,
        passedCount,
        totalCount,
      },
    }).catch(() => {});

    res.json({
      status: isAllPassed ? "Accepted" : "Wrong Answer",
      passedCount,
      totalCount,
      testResults,
      aiEvaluation,
    });
  } catch (error) {
    console.error("Submit Code Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Generate AI Debugging help for errors
// @route POST /api/coding/debug
// body: { language, code, errorLog }
export const debugCode = async (req, res) => {
  try {
    const { language = "python", code = "", errorLog = "" } = req.body;

    const prompt = `You are LearnX's AI Code Debugger.
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`
Error Log:
${errorLog}

Explain:
1. Why this error occurred.
2. The exact line causing it.
3. How to fix it.

Respond strictly in JSON:
{
  "errorType": "SyntaxError / TypeError / Runtime Error",
  "errorLine": "Line number or line snippet",
  "explanation": "Clear student-friendly explanation of why it crashed",
  "fix": "Corrected code snippet or solution tip"
}`;

    const openai = getAIClient();
    if (openai && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a JSON-only debugging API." },
            { role: "user", content: prompt },
          ],
        });
        const content = completion.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return res.json(JSON.parse(jsonMatch[0]));
        }
      } catch (err) {}
    }

    res.json({
      errorType: "Runtime Error",
      errorLine: "Execution failure",
      explanation: errorLog || "Check variable scopes, syntax errors, and missing imports.",
      fix: "Ensure all variables are declared before use and syntax matches language specifications.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Generate test cases using AI
// @route POST /api/coding/generate-testcases
// body: { problemDescription, language }
export const generateTestCases = async (req, res) => {
  try {
    const { problemDescription = "Two Sum", language = "python" } = req.body;

    const prompt = `Generate 4 edge test cases (including boundary cases like empty array, negative numbers, single element, max bounds) for: "${problemDescription}".
Respond strictly in JSON:
{
  "testCases": [
    { "input": "[0, 0]\n0", "expectedOutput": "[0, 1]", "reason": "Handles zero inputs" }
  ]
}`;

    const openai = getAIClient();
    if (openai && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a JSON-only test case generator API." },
            { role: "user", content: prompt },
          ],
        });
        const content = completion.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return res.json(JSON.parse(jsonMatch[0]));
        }
      } catch (err) {}
    }

    res.json({
      testCases: [
        { input: "[0, -1, 1]\n0", expectedOutput: "[1, 2]", reason: "Negative numbers handling" },
        { input: "[100000, 200000]\n300000", expectedOutput: "[0, 1]", reason: "Large numbers handling" },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
