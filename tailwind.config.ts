import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#030303",
        foreground: "#f4f4f5",
        canvas: {
          DEFAULT: "#030303",
          surface: "#09090b",
          elevated: "#121215",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        brand: {
          primary: "#6366f1", // Indigo
          violet: "#8b5cf6",
          cyan: "#06b6d4",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Consolas",
          "Menlo",
          "monospace",
        ],
        jakarta: [
          "'Plus Jakarta Sans'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        "aurora-slow": "auroraDrift 24s ease-in-out infinite alternate",
        "aurora-reverse": "auroraDriftReverse 28s ease-in-out infinite alternate",
        "pulse-subtle": "pulseSubtle 6s ease-in-out infinite",
        "shimmer": "shimmer 2.2s linear infinite",
      },
      keyframes: {
        auroraDrift: {
          "0%": {
            transform: "translate(0%, 0%) scale(1)",
            opacity: "0.45",
          },
          "50%": {
            transform: "translate(8%, 12%) scale(1.15)",
            opacity: "0.65",
          },
          "100%": {
            transform: "translate(-6%, 6%) scale(0.95)",
            opacity: "0.4",
          },
        },
        auroraDriftReverse: {
          "0%": {
            transform: "translate(0%, 0%) scale(1.1)",
            opacity: "0.35",
          },
          "50%": {
            transform: "translate(-10%, -8%) scale(0.9)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translate(5%, -4%) scale(1.05)",
            opacity: "0.3",
          },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
