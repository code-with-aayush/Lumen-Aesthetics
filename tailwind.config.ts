import type { Config } from "tailwindcss";

// Design tokens — source of truth: PRD §2.1, §7.3
// Do not add new colors or fonts. Every component reads from this.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumen: {
          black: "#0A0A0A", // primary background — NOT #000, NOT #111
          dark: "#141414", // cards, alternate sections
          gold: "#B8974A", // accent only — borders, underlines, numbers, button outlines
          "gold-light": "#F7F1E6", // text on gold elements, subtle warm fills
          offwhite: "#E8E8E8", // body text on dark — never pure white
          muted: "#888888", // labels, captions, secondary info
          border: "#2A2A2A", // subtle borders
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "DM Sans", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
        wider: "0.15em",
        wide: "0.08em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
