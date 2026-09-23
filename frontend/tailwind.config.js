export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono:  ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        bg:      "#f0f6fc",   /* soft blue white — global page background */
        surface: "#ffffff",
        surface2:"#e8f2fb",
        accent: {
          DEFAULT: "#0284c7",  /* sky-600 */
          2: "#2563eb",        /* blue-600 */
          3: "#059669",        /* emerald */
        },
        brand: {
          400: "#38bdf8",  /* sky-400 */
          500: "#0ea5e9",  /* sky-500 */
          600: "#0284c7",  /* sky-600 */
          700: "#0369a1",  /* sky-700 */
        },
        sky: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        dark: {
          900: "#0f172a",  /* slate-900 */
          800: "#1e293b",  /* slate-800 */
          700: "#334155",  /* slate-700 */
          600: "#475569",  /* slate-600 */
        },
      },
      borderRadius: {
        sm:  "0.5rem",
        DEFAULT: "0.875rem",
        lg:  "1.25rem",
        xl:  "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(2,132,199,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        DEFAULT:"0 4px 16px rgba(2,132,199,0.09), 0 1px 3px rgba(0,0,0,0.04)",
        lg:   "0 12px 40px rgba(2,132,199,0.12), 0 2px 6px rgba(0,0,0,0.05)",
        "glow-blue":   "0 0 24px rgba(2,132,199,0.20)",
        "glow-sky":    "0 0 24px rgba(14,165,233,0.22)",
        "glow-blue-lg": "0 0 40px rgba(2,132,199,0.28)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "btn-gradient":    "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
        "card-gradient":   "linear-gradient(160deg, #ffffff 0%, #f0f6fc 100%)",
      },
      animation: {
        "fade-in-up":  "fadeInUp 0.42s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":     "fadeIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in":    "slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-glow":  "pulseGlow 3s ease-in-out infinite",
        "float-orb":   "floatOrb 14s ease-in-out infinite",
        "shimmer":     "shimmer 2.2s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(167,139,250,0.2)" },
          "50%":      { boxShadow: "0 0 28px rgba(167,139,250,0.45)" },
        },
        floatOrb: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-30px) scale(1.04)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      backdropBlur: {
        xs: "2px",
        sm: "8px",
        DEFAULT: "16px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};
