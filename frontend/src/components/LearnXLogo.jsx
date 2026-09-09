import React from "react";

export const LearnXIcon = ({ size = 32, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="LearnX Logo Mark"
    >
      <defs>
        <linearGradient id="learnx-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="learnx-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="learnx-cap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Graduation Cap atop student head */}
      <path
        d="M100 18 L152 42 L100 66 L48 42 Z"
        fill="url(#learnx-cap-grad)"
      />
      <path
        d="M100 66 L100 78 C100 84 135 84 135 78 L135 49.5"
        stroke="#1e40af"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tassel */}
      <path
        d="M52 44 L44 65 L48 66"
        stroke="#2563eb"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Head circle */}
      <circle cx="100" cy="80" r="18" fill="url(#learnx-grad-purple)" />

      {/* Upward Reaching Arms / Torso */}
      <path
        d="M74 116 C82 98 118 98 126 116 C116 128 84 128 74 116 Z"
        fill="url(#learnx-grad-purple)"
      />

      {/* Left 'L' Ribbon Base */}
      <path
        d="M42 68 C42 62 48 58 54 58 H76 C79 58 82 61 82 64 V138 C82 152 94 164 108 164 H146 C152 164 156 170 154 176 C151 184 142 190 128 190 H68 C48 190 42 174 42 154 Z"
        fill="url(#learnx-grad-blue)"
      />

      {/* Right 'X' Cross-Ribbon 1 (Diagonal /) */}
      <path
        d="M110 102 C114 96 122 96 126 102 L178 174 C184 182 178 190 168 190 H142 C136 190 130 186 126 180 L94 134 Z"
        fill="url(#learnx-grad-purple)"
      />

      {/* Right 'X' Cross-Ribbon 2 (Diagonal \) */}
      <path
        d="M152 80 C158 80 162 84 166 90 L188 124 C192 130 188 138 180 138 H162 C156 138 150 134 146 128 L134 110 Z"
        fill="url(#learnx-grad-blue)"
      />
    </svg>
  );
};

export const LearnXLogo = ({
  size = "md",
  showTagline = false,
  showBadge = false,
  className = "",
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  const currentIconSize = iconSizes[size] || 36;
  const currentTextSize = textSizes[size] || "text-xl";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <LearnXIcon size={currentIconSize} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${currentTextSize}`}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            <span className="text-slate-900">LEARN</span>
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
              X
            </span>
          </span>
          {showBadge && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 uppercase tracking-wider">
              AI
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-tight mt-0.5">
            Learn. Practice. Grow. Succeed.
          </span>
        )}
      </div>
    </div>
  );
};

export default LearnXLogo;
