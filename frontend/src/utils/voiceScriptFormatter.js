/**
 * LearnX Voice Teacher Script Formatter & Cleaner
 * Converts raw AI markdown responses into a natural, pedagogical teaching script.
 * Removes symbols, expands computer science terminology, and chunks into natural sentences.
 * Supports English, Hindi (हिन्दी), and Hinglish modes.
 */

// Expand common CSE abbreviations for natural TTS pronunciation (English mode only)
const CSE_PHONETIC_REPLACEMENTS = [
  { regex: /\b1NF\b/gi, replacement: "First Normal Form" },
  { regex: /\b2NF\b/gi, replacement: "Second Normal Form" },
  { regex: /\b3NF\b/gi, replacement: "Third Normal Form" },
  { regex: /\bBCNF\b/gi, replacement: "Boyce-Codd Normal Form" },
  { regex: /\b4NF\b/gi, replacement: "Fourth Normal Form" },
  { regex: /\b5NF\b/gi, replacement: "Fifth Normal Form" },
  { regex: /\bBST\b/gi, replacement: "Binary Search Tree" },
  { regex: /\bDBMS\b/gi, replacement: "D B M S" },
  { regex: /\bRDBMS\b/gi, replacement: "Relational D B M S" },
  { regex: /\bSQL\b/gi, replacement: "S Q L" },
  { regex: /\bDDL\b/gi, replacement: "Data Definition Language" },
  { regex: /\bDML\b/gi, replacement: "Data Manipulation Language" },
  { regex: /\bFD\b/gi, replacement: "Functional Dependency" },
  { regex: /\bFDs\b/gi, replacement: "Functional Dependencies" },
  { regex: /\bPK\b/gi, replacement: "Primary Key" },
  { regex: /\bFK\b/gi, replacement: "Foreign Key" },
  { regex: /\bACID\b/gi, replacement: "Acid properties: Atomicity, Consistency, Isolation, and Durability" },
  { regex: /\bO\(1\)/gi, replacement: "O of 1" },
  { regex: /\bO\(log\s*N\)/gi, replacement: "O of log N" },
  { regex: /\bO\(N\)/gi, replacement: "O of N" },
  { regex: /\bO\(N\s*log\s*N\)/gi, replacement: "O of N log N" },
  { regex: /\bO\(N\^2\)/gi, replacement: "O of N squared" },
  { regex: /\bO\(2\^N\)/gi, replacement: "O of 2 to the power N" },
  { regex: /\bFIFO\b/gi, replacement: "First-In First-Out" },
  { regex: /\bLIFO\b/gi, replacement: "Last-In First-Out" },
  { regex: /\bFCFS\b/gi, replacement: "First Come First Served" },
  { regex: /\bSJF\b/gi, replacement: "Shortest Job First" },
  { regex: /\bRR\b/gi, replacement: "Round Robin" },
  { regex: /->|→/g, replacement: " functionally determines " },
  { regex: /!=|≠/g, replacement: " is not equal to " },
  { regex: /<=|≤/g, replacement: " is less than or equal to " },
  { regex: />=|≥/g, replacement: " is greater than or equal to " },
  { regex: /==/g, replacement: " is equal to " },
  { regex: /\bapprox\b/gi, replacement: "approximately" },
  { regex: /\beg\b|\be\.g\.\b/gi, replacement: "for example" },
  { regex: /\bie\b|\bi\.e\.\b/gi, replacement: "that is" },
];

// Hindi/Hinglish operator replacements (keep technical acronyms as-is for TTS)
const CSE_PHONETIC_REPLACEMENTS_HI = [
  { regex: /->|→/g, replacement: " से निर्धारित होता है " },
  { regex: /!=|≠/g, replacement: " के बराबर नहीं " },
  { regex: /<=|≤/g, replacement: " से कम या बराबर " },
  { regex: />=|≥/g, replacement: " से अधिक या बराबर " },
  { regex: /==/g, replacement: " बराबर है " },
];

/** Language-aware heading transition */
const makeHeadingTransition = (heading, lang) => {
  const clean = heading.replace(/[^\w\s\u0900-\u097F-]/g, "").trim();
  if (!clean) return "";
  if (lang === "hindi")    return ` आइए ${clean} को समझते हैं। `;
  if (lang === "hinglish") return ` Chaliye ${clean} ko samjhte hain. `;
  return ` Let's understand ${clean}. `;
};

/** Language-aware note/blockquote prefix */
const makeNotePrefix = (lang) => {
  if (lang === "hindi")    return " ध्यान दें: ";
  if (lang === "hinglish") return " Dhyan den: ";
  return " Important note: ";
};

/** Language-aware code block placeholder */
const makeCodePlaceholder = (lang) => {
  if (lang === "hindi")    return " यहाँ स्क्रीन पर code implementation दिखाया गया है। ";
  if (lang === "hinglish") return " Yahan screen par code implementation dikh raha hai. ";
  return " Here is the code implementation shown on your screen. ";
};

/**
 * Clean markdown and format into natural teaching speech.
 * Language-aware: supports "english", "hindi", "hinglish"
 */
export const formatTeachingScript = (rawMarkdown = "", options = {}) => {
  if (!rawMarkdown || typeof rawMarkdown !== "string") {
    return { fullScript: "", chunks: [] };
  }

  const lang = (options.language || "english").toLowerCase();
  let text = rawMarkdown;

  // 1. Replace code blocks with language-aware speech transition
  text = text.replace(/```[\s\S]*?```/g, makeCodePlaceholder(lang));
  text = text.replace(/`([^`]+)`/g, "$1");

  // 2. Transform Headings into spoken introductions (language-aware)
  text = text.replace(/^#+\s*(.+)$/gm, (_, heading) => makeHeadingTransition(heading, lang));

  // 3. Clean markdown formatting
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // Bold
  text = text.replace(/\*([^*]+)\*/g, "$1"); // Italics
  text = text.replace(/_([^_]+)_/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // Links
  text = text.replace(/^[-*+]\s+/gm, " "); // Unordered list bullets
  text = text.replace(/^\d+\.\s+/gm, " "); // Ordered lists
  text = text.replace(/>?\s*([^\n]+)/g, (_, content) => `${makeNotePrefix(lang)}${content} `); // Callouts

  // 4. Remove emojis and web symbols that cause speech synth glitches
  text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, " ");

  // 5. Expand CSE terminology (only English phonetic replacements for English)
  if (lang === "english") {
    CSE_PHONETIC_REPLACEMENTS.forEach(({ regex, replacement }) => {
      text = text.replace(regex, replacement);
    });
  } else {
    // For Hindi/Hinglish apply only operator replacements; keep acronyms for TTS
    CSE_PHONETIC_REPLACEMENTS_HI.forEach(({ regex, replacement }) => {
      text = text.replace(regex, replacement);
    });
  }

  // 6. Clean whitespace and excess punctuation
  text = text.replace(/[\\/#|_~^]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  // 7. Smart Sentence Chunking
  // For Hindi, also split on । (Devanagari danda)
  const sentencePattern = (lang === "hindi" || lang === "hinglish")
    ? /(?<=[.?!:।])\s+/
    : /(?<=[.?!:])\s+/;
  const rawSentences = text.split(sentencePattern);

  const chunks = [];
  rawSentences.forEach((s) => {
    let clean = s.trim();
    // Remove leading/trailing non-alphanumeric (preserve Devanagari Unicode range \u0900-\u097F)
    clean = clean.replace(/^[^\w"'\u0900-\u097F]+|[^\w"'\u0900-\u097F.?!।]+$/g, "").trim();

    if (clean.length > 3) {
      // If a sentence is very long (> 160 chars), break it naturally at a comma or semicolon
      if (clean.length > 160 && (clean.includes(",") || clean.includes("।"))) {
        const parts = clean.split(/[,।]\s*/);
        let temp = "";
        parts.forEach((p) => {
          if ((temp + ", " + p).length < 120) {
            temp = temp ? `${temp}, ${p}` : p;
          } else {
            if (temp) chunks.push(temp.endsWith(".") || temp.endsWith("।") ? temp : `${temp}.`);
            temp = p;
          }
        });
        if (temp) chunks.push(temp.endsWith(".") || temp.endsWith("।") ? temp : `${temp}.`);
      } else {
        if (!/[.?!।]$/.test(clean)) clean += ".";
        chunks.push(clean);
      }
    }
  });

  const fullScript = chunks.join(" ");

  const defaultFallback =
    lang === "hindi" ? "LearnX में आपका स्वागत है। इस विषय के बारे में कुछ भी पूछें।" :
    lang === "hinglish" ? "LearnX mein aapka swagat hai. Is topic ke baare mein kuch bhi pucho." :
    "Welcome to LearnX. Ask me anything about this topic.";

  return {
    fullScript,
    chunks: chunks.length > 0 ? chunks : [text || defaultFallback],
  };
};

/**
 * Filter and sort available browser voices for optimum clarity and naturalness.
 * For Hindi: strictly prefer hi-IN voices. Does NOT silently fall through to English.
 * For Hinglish: prefer hi-IN or en-IN.
 */
export const getBestBrowserVoice = (voices = [], language = "english") => {
  if (!voices || voices.length === 0) return null;

  const lang = (language || "english").toLowerCase();

  if (lang === "hindi" || lang === "hinglish") {
    // Priority 1: Exact hi-IN locale
    const hiIN = voices.find((v) => v.lang === "hi-IN");
    if (hiIN) return hiIN;

    // Priority 2: Any voice starting with "hi"
    const hiAny = voices.find((v) => v.lang.startsWith("hi"));
    if (hiAny) return hiAny;

    // Priority 3: Named Hindi voices
    const namedHindi = voices.find(
      (v) =>
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("hemant") ||
        v.name.toLowerCase().includes("kalpana") ||
        v.name.toLowerCase().includes("lekha")
    );
    if (namedHindi) return namedHindi;

    // Priority 4 (Hinglish only): Indian English voice
    if (lang === "hinglish") {
      const indianEng = voices.find(
        (v) =>
          v.lang === "en-IN" ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("rishi") ||
          v.name.toLowerCase().includes("veena") ||
          v.name.toLowerCase().includes("ravi") ||
          v.name.toLowerCase().includes("heera")
      );
      if (indianEng) return indianEng;
    }

    // For strict Hindi mode: return null — caller should warn user instead of
    // silently using an English voice that cannot speak Hindi correctly.
    if (lang === "hindi") return null;
  }

  // English selection priority:
  // 1. Google / Microsoft Natural / Apple Enhanced voices
  const highQualityEng = voices.find(
    (v) =>
      (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang === "en-IN") &&
      (v.name.includes("Natural") ||
        v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.name.includes("Daniel") ||
        v.name.includes("Karen") ||
        v.name.includes("Rishi") ||
        v.name.includes("Veena"))
  );
  if (highQualityEng) return highQualityEng;

  // 2. Default English voice
  const defaultEng = voices.find((v) => v.lang.startsWith("en") && v.default);
  if (defaultEng) return defaultEng;

  // 3. Any English voice
  const anyEng = voices.find((v) => v.lang.startsWith("en"));
  if (anyEng) return anyEng;

  return voices[0] || null;
};
