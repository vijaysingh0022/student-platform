import React, { useState } from "react";
import { marked } from "marked";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Custom CodeBlock component with copy functionality & terminal aesthetic
 */
export const CodeBlock = ({ code, language = "code" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="my-3.5 rounded-xl overflow-hidden text-xs"
      style={{
        background: "rgba(13, 13, 29, 0.95)",
        border: "1px solid rgba(124, 58, 237, 0.25)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Code Header */}
      <div
        className="flex items-center justify-between px-3.5 py-2"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
          </div>
          <span
            className="text-[11px] font-mono font-semibold uppercase tracking-wider ml-1"
            style={{ color: "#a78bfa" }}
          >
            {language || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200"
          style={{
            background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
            border: copied ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
            color: copied ? "#34d399" : "rgba(226, 232, 240, 0.7)",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      {/* Code Content */}
      <pre
        className="p-4 overflow-x-auto font-mono text-[12px] leading-relaxed"
        style={{ color: "#e2e8f0" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Splits text into markdown segments and fenced code block segments
 */
const parseContentWithCodeBlocks = (content) => {
  if (!content) return [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "markdown",
        content: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      language: match[1] || "plaintext",
      code: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "markdown",
      content: content.slice(lastIndex),
    });
  }

  return segments;
};

const MarkdownRenderer = ({ content }) => {
  const segments = parseContentWithCodeBlocks(content);

  return (
    <div className="tutor-markdown-content space-y-2.5 leading-relaxed text-sm">
      {segments.map((segment, index) => {
        if (segment.type === "code") {
          return (
            <CodeBlock
              key={index}
              code={segment.code}
              language={segment.language}
            />
          );
        }

        // Render HTML for markdown text
        const html = marked.parse(segment.content);
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
            className="prose-dark"
          />
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
