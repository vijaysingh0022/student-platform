import https from "https";

/**
 * Robustly extracts the 11-character YouTube video ID from any format:
 * - https://www.youtube.com/watch?v=kqtD5dpn9C8
 * - https://youtu.be/kqtD5dpn9C8
 * - https://www.youtube.com/embed/kqtD5dpn9C8
 * - https://www.youtube-nocookie.com/embed/kqtD5dpn9C8
 * - https://www.youtube.com/v/kqtD5dpn9C8
 * - kqtD5dpn9C8 (bare 11-char ID)
 */
export const extractYouTubeVideoId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const clean = urlOrId.trim();

  // If already an 11-character alphanumeric/hyphen/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // Regex covering all YouTube URL variations
  const regExp =
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = clean.match(regExp);
  return match ? match[1] : null;
};

/**
 * Constructs a secure, privacy-enhanced YouTube embed URL with
 * official recommended attributes and sandbox origin isolation.
 */
export const getCleanYouTubeEmbedUrl = (urlOrId, startSec = 0) => {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) return null;

  const startParam = startSec > 0 ? `&start=${Math.floor(startSec)}` : "";
  // Uses youtube-nocookie.com to minimize cross-origin tracking blocks
  // enablejsapi=1 allows HTML5 iframe communication
  // origin parameter prevents embedding domain mismatch errors
  return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0&modestbranding=1&playsinline=1${startParam}`;
};

/**
 * Verifies live whether a YouTube video is currently playable and available
 * by querying the official YouTube oEmbed endpoint.
 *
 * Returns:
 * {
 *   isValid: boolean,
 *   status: "playable" | "unavailable" | "restricted" | "invalid_url",
 *   title?: string,
 *   author?: string,
 *   extractedId: string | null,
 *   message: string
 * }
 */
export const verifyYouTubeVideoPlayable = (urlOrId) => {
  return new Promise((resolve) => {
    const videoId = extractYouTubeVideoId(urlOrId);
    if (!videoId) {
      return resolve({
        isValid: false,
        status: "invalid_url",
        extractedId: null,
        message: "Invalid YouTube URL or Video ID format.",
      });
    }

    const testUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const req = https.get(
      testUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
        timeout: 7000,
      },
      (res) => {
        if (res.statusCode === 200) {
          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(rawData);
              resolve({
                isValid: true,
                status: "playable",
                extractedId: videoId,
                title: parsed.title,
                author: parsed.author_name,
                message: "Video is verified playable and public.",
              });
            } catch (parseErr) {
              resolve({
                isValid: true,
                status: "playable",
                extractedId: videoId,
                message: "Video responded with 200 OK.",
              });
            }
          });
        } else if (res.statusCode === 404) {
          resolve({
            isValid: false,
            status: "unavailable",
            extractedId: videoId,
            message: "Video is deleted, private, or not found on YouTube (404).",
          });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          resolve({
            isValid: false,
            status: "restricted",
            extractedId: videoId,
            message: "Video embedding is disabled or restricted by the content owner.",
          });
        } else {
          resolve({
            isValid: false,
            status: "unavailable",
            extractedId: videoId,
            message: `YouTube returned status HTTP ${res.statusCode}.`,
          });
        }
      }
    );

    req.on("timeout", () => {
      req.destroy();
      resolve({
        isValid: false,
        status: "unavailable",
        extractedId: videoId,
        message: "YouTube verification timed out.",
      });
    });

    req.on("error", (err) => {
      resolve({
        isValid: false,
        status: "unavailable",
        extractedId: videoId,
        message: `Network error verifying video: ${err.message}`,
      });
    });
  });
};

/**
 * Validates whether a candidate YouTube video title is genuinely relevant to the requested topic.
 * Prevents cross-topic / cross-subject mismatches (e.g. assigning Binary Search to Intro to Data Structures,
 * or assigning DBMS videos to C++ pointers).
 */
export const isVideoRelevantToTopic = (
  { topicTitle, subtopics = [], chapterTitle = "", unitTitle = "", subjectName = "" },
  videoTitle
) => {
  if (!topicTitle || !videoTitle) return false;

  const stem = (w) =>
    w
      .toLowerCase()
      .replace(/s$/, "")
      .replace(/ing$/, "")
      .replace(/ed$/, "");

  const extractTokens = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .map(stem);

  const genericStopWords = new Set([
    "introduction",
    "intro",
    "basic",
    "fundamental",
    "overview",
    "lecture",
    "tutorial",
    "course",
    "video",
    "hindi",
    "english",
    "part",
    "what",
    "with",
    "from",
    "and",
    "the",
    "for",
    "learn",
    "complete",
    "full",
    "gate",
    "masterclass",
    "guide",
    "class",
    "example",
    "note",
    "concept",
    "chapter",
    "unit",
    "easy",
    "advanced",
    "series",
    "explained",
    "explanation",
  ]);

  const topicTokens = extractTokens(topicTitle);
  const videoTokens = new Set(extractTokens(videoTitle));

  // 1. Cross-Subject Contamination Guard:
  // Detect if video belongs to an unrelated subject domain that differs from current topic
  const domainSignatures = {
    dbms: ["dbms", "database", "sql", "normalization", "relational", "schema", "table"],
    os: ["operating", "kernel", "deadlock", "paging", "semaphore"],
    cn: ["networking", "network", "tcp", "udp", "osi", "ip", "subnet"],
    dsa: ["dsa", "algorithm", "array", "stack", "queue", "tree", "graph", "sorting", "searching", "linked"],
    python: ["python", "django", "flask", "numpy", "pandas"],
    java: ["java", "jvm", "spring"],
    cpp: ["cpp", "pointer", "cplusplus"],
  };

  const currentSubjectStr = `${subjectName} ${topicTitle} ${chapterTitle} ${unitTitle}`.toLowerCase();

  for (const [domainKey, keywords] of Object.entries(domainSignatures)) {
    const isTopicInDomain = keywords.some((k) => currentSubjectStr.includes(k));
    if (!isTopicInDomain) {
      // If the topic is definitely NOT in this domain, check if video title prominently features domain exclusive tokens
      const primaryKeywords = keywords.slice(0, 2);
      const videoHasDomain = primaryKeywords.some((pk) => videoTokens.has(stem(pk)));
      if (videoHasDomain) {
        return false; // Mismatched subject domain
      }
    }
  }

  // 2. Specific Topic Keyword Matching
  const coreTopicTokens = topicTokens.filter((t) => !genericStopWords.has(t));
  const matchedCore = coreTopicTokens.filter((t) => videoTokens.has(t));
  if (coreTopicTokens.length > 0 && matchedCore.length >= 1) {
    return true;
  }

  // 3. Subtopics matching
  for (const sub of subtopics) {
    const subTokens = extractTokens(sub).filter((t) => !genericStopWords.has(t));
    const matchedSub = subTokens.filter((t) => videoTokens.has(t));
    if (subTokens.length > 0 && matchedSub.length >= 1) {
      return true;
    }
  }

  // 4. Chapter title matching
  if (chapterTitle && chapterTitle !== topicTitle) {
    const chapterTokens = extractTokens(chapterTitle).filter((t) => !genericStopWords.has(t));
    const matchedChapter = chapterTokens.filter((t) => videoTokens.has(t));
    if (chapterTokens.length > 0 && matchedChapter.length >= 1) {
      return true;
    }
  }

  return false;
};


