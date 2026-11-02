import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, RefreshCw, Palette } from "lucide-react";

// Predefined curated color themes
export const TUBES_PRESETS = {
  brand: {
    name: "LearnX Cyber",
    tubes: ["#6366f1", "#3b82f6", "#8b5cf6"],
    lights: ["#60a5fa", "#a78bfa", "#38bdf8", "#818cf8"],
  },
  neon: {
    name: "Neon Synthwave",
    tubes: ["#f967fb", "#53bc28", "#6958d5"],
    lights: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
  },
  matrix: {
    name: "Emerald Matrix",
    tubes: ["#10b981", "#059669", "#34d399"],
    lights: ["#10b981", "#6ee7b7", "#047857", "#a7f3d0"],
  },
  sunset: {
    name: "Electric Sunset",
    tubes: ["#f43f5e", "#fb923c", "#ec4899"],
    lights: ["#fb7185", "#fdba74", "#f472b6", "#e11d48"],
  },
  galaxy: {
    name: "Deep Galaxy",
    tubes: ["#06b6d4", "#8b5cf6", "#ec4899"],
    lights: ["#22d3ee", "#c084fc", "#f472b6", "#38bdf8"],
  },
};

// Helper for generating random vibrant hex colors
export const generateRandomColors = (count) => {
  return Array.from({ length: count }, () => {
    // Generate saturated, vibrant hex color
    const hue = Math.floor(Math.random() * 360);
    // Convert HSL to Hex with 85% saturation & 60% lightness for bright neon
    return hslToHex(hue, 85, 60);
  });
};

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * TubesBackground - Interactive 3D WebGL Neon Tubes Background
 * 
 * @param {React.ReactNode} children - Content overlaid on top of the 3D canvas
 * @param {string} className - Additional CSS class names
 * @param {boolean} enableClickInteraction - Whether clicking canvas randomizes colors
 * @param {keyof TUBES_PRESETS} preset - Default theme preset ('brand', 'neon', 'matrix', 'sunset', 'galaxy')
 * @param {string[]} tubesColors - Custom tube colors override
 * @param {string[]} lightsColors - Custom lights colors override
 * @param {number} lightIntensity - WebGL light intensity (default: 200)
 * @param {boolean} showBadge - Show subtle interactive helper badge
 * @param {boolean} showControls - Show floating theme switch & randomize button
 * @param {string} minHeight - Minimum height (default: "400px")
 */
export function TubesBackground({
  children,
  className = "",
  enableClickInteraction = true,
  preset = "brand",
  tubesColors,
  lightsColors,
  lightIntensity = 200,
  showBadge = false,
  showControls = false,
  minHeight = "400px",
  backgroundColor = "bg-slate-950",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const tubesRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activePreset, setActivePreset] = useState(preset);
  const [currentColorScheme, setCurrentColorScheme] = useState(() => {
    const p = TUBES_PRESETS[preset] || TUBES_PRESETS.brand;
    return {
      tubes: tubesColors || p.tubes,
      lights: lightsColors || p.lights,
    };
  });

  // Dynamic import bypassing Vite's static analysis
  useEffect(() => {
    let mounted = true;
    let cleanup = null;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        // Native browser dynamic import via Function to avoid bundler resolution issues
        const importDynamic = new Function("url", "return import(url)");
        const module = await importDynamic(
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        );

        if (!mounted || !canvasRef.current) return;

        const TubesCursor = module.default;
        const initialPreset = TUBES_PRESETS[activePreset] || TUBES_PRESETS.brand;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: tubesColors || initialPreset.tubes,
            lights: {
              intensity: lightIntensity,
              colors: lightsColors || initialPreset.lights,
            },
          },
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          // The library handles container resize internally, but we trigger a window event if needed
        };

        window.addEventListener("resize", handleResize);

        cleanup = () => {
          window.removeEventListener("resize", handleResize);
          if (app && typeof app.dispose === "function") {
            try {
              app.dispose();
            } catch (err) {
              console.warn("TubesCursor dispose:", err);
            }
          }
          tubesRef.current = null;
        };
      } catch (err) {
        console.error("Failed to initialize TubesCursor 3D background:", err);
        if (mounted) {
          setLoadFailed(true);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  // Update colors when preset or props change
  const applyColors = useCallback((tubes, lights) => {
    if (!tubesRef.current || !tubesRef.current.tubes) return;
    try {
      tubesRef.current.tubes.setColors(tubes);
      tubesRef.current.tubes.setLightsColors(lights);
      setCurrentColorScheme({ tubes, lights });
    } catch (err) {
      console.warn("Could not apply tube colors:", err);
    }
  }, []);

  const randomizeColors = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!tubesRef.current) return;
    const newTubes = generateRandomColors(3);
    const newLights = generateRandomColors(4);
    applyColors(newTubes, newLights);
  }, [applyColors]);

  const switchPreset = useCallback((presetKey) => {
    setActivePreset(presetKey);
    const p = TUBES_PRESETS[presetKey];
    if (p) {
      applyColors(p.tubes, p.lights);
    }
  }, [applyColors]);

  const handleContainerClick = (e) => {
    if (!enableClickInteraction) return;
    // Don't trigger if user clicked an interactive control
    if (e.target.closest("button, a, input, [data-interactive='true']")) {
      return;
    }
    randomizeColors();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full overflow-hidden ${backgroundColor} ${className}`}
      style={{ minHeight }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ touchAction: "none" }}
      />

      {/* Fallback Ambient Glow if WebGL is loading or unavailable */}
      {(!isLoaded || loadFailed) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      {/* Optional Top/Bottom Floating Controls */}
      {showControls && isLoaded && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1.5 shadow-xl text-xs text-slate-200">
          <Palette className="w-3.5 h-3.5 text-blue-400" />
          <select
            value={activePreset}
            onChange={(e) => switchPreset(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {Object.entries(TUBES_PRESETS).map(([key, item]) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {item.name}
              </option>
            ))}
          </select>
          <span className="w-px h-3 bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={randomizeColors}
            title="Randomize neon colors"
            className="flex items-center gap-1 text-slate-300 hover:text-white transition font-medium"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px]">Shuffle</span>
          </button>
        </div>
      )}

      {/* Optional Interactive Helper Badge */}
      {showBadge && isLoaded && enableClickInteraction && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-400 text-[11px] font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Move cursor to guide 3D neon tubes • Click to randomize</span>
        </div>
      )}

      {/* Content Overlay Layer */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
