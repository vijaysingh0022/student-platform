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
        bg:      "#f8f8fc",
        surface: "#ffffff",
        surface2:"#f1f1f7",
        accent: {
          DEFAULT: "#7c3aed",
          2: "#0ea5e9",
          3: "#059669",
        },
        brand: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        dark: {
          900: "#1a1a2e",
          800: "#2d2d44",
          700: "#4a4a68",
          600: "#6e6e8d",
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
        sm:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        DEFAULT:"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        lg:   "0 12px 40px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05)",
        "glow-purple": "0 0 24px rgba(124,58,237,0.18)",
        "glow-sky":    "0 0 24px rgba(14,165,233,0.18)",
        "glow-purple-lg": "0 0 40px rgba(124,58,237,0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "btn-gradient":    "linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)",
        "card-gradient":   "linear-gradient(160deg, #ffffff 0%, #f8f8fc 100%)",
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
