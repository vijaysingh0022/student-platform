import React, { useState } from "react";
import { Download, Maximize2, Minimize2, ZoomIn, ZoomOut, Check, Copy, Eye } from "lucide-react";

export const AcademicDiagramViewer = ({ diagram }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!diagram || !diagram.svg) return null;

  const handleDownloadSVG = () => {
    const blob = new Blob([diagram.svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${diagram.id || "academic_diagram"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySVG = () => {
    navigator.clipboard.writeText(diagram.svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setZoomLevel(1);

  return (
    <div
      className={`my-6 rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all ${
        isFullscreen
          ? "fixed inset-4 z-50 shadow-2xl flex flex-col justify-between bg-white/95 backdrop-blur-md"
          : "relative"
      }`}
    >
      {/* Top Banner / Academic Figure Header */}
      <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
            {diagram.figure || "Figure 1"}
          </span>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {diagram.title}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {diagram.category || "Academic Visual Architecture"} • {diagram.subject || "CSE"}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={zoomOut}
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={resetZoom}
            className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors"
            title="Reset zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={zoomIn}
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          {/* Download SVG */}
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs transition-all"
            title="Download vector diagram (SVG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SVG Visualization Canvas */}
      <div
        className="p-4 sm:p-6 flex items-center justify-center overflow-auto bg-slate-50/40 min-h-[300px] select-none"
        style={{ maxHeight: isFullscreen ? "calc(100vh - 180px)" : "500px" }}
      >
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
          className="transition-transform duration-150 w-full max-w-3xl flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: diagram.svg }}
        />
      </div>

      {/* Caption & Step-by-Step Academic Notes */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-3">
        {diagram.caption && (
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            <span className="font-extrabold text-slate-800">Visual Specification: </span>
            {diagram.caption}
          </p>
        )}

        {Array.isArray(diagram.explanation) && diagram.explanation.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Diagram Breakdown & Architectural Flow</span>
            </h5>
            <ul className="space-y-1.5">
              {diagram.explanation.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 font-medium leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicDiagramViewer;
