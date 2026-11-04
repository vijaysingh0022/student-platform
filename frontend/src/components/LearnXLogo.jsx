import React from "react";

export const LearnXIcon = ({ size = 32, className = "" }) => {
  return (
    <img
      src="/learnx-icon.png"
      alt="LearnX Mark"
      width={size}
      height={size}
      className={`object-contain select-none shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
    />
  );
};

export const LearnXLogo = ({
  size = "md",
  showTagline = false,
  showBadge = false,
  className = "",
  variant = "brand", // "brand" (full image logo) | "split" (icon + text)
  darkBg = false,
}) => {
  const heightSizes = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11",
    xl: "h-14",
  };

  const currentHeight = heightSizes[size] || "h-9";
  const logoSrc = darkBg ? "/learnx-logo-white.png" : "/learnx-logo.png";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center">
        <img
          src={logoSrc}
          alt="LearnX"
          className={`${currentHeight} w-auto object-contain select-none`}
          loading="eager"
        />
        {showBadge && (
          <span className="ml-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 uppercase tracking-wider self-center">
            AI
          </span>
        )}
      </div>
      {showTagline && (
        <span className={`text-[10px] sm:text-xs font-bold tracking-tight ml-1 hidden sm:inline ${darkBg ? "text-slate-300" : "text-slate-500"}`}>
          Learn. Practice. Grow. Succeed.
        </span>
      )}
    </div>
  );
};

export default LearnXLogo;
