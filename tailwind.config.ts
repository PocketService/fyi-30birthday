import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Admin palette
        warm: {
          50: "#fdf8f0", 100: "#faebd7", 200: "#f5d5ae", 300: "#efb97b",
          400: "#e89846", 500: "#e27d24", 600: "#d3641a", 700: "#af4c17",
          800: "#8c3d1b", 900: "#723319",
        },
        rose: {
          50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af",
          400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
          800: "#9f1239", 900: "#881337",
        },
        // Brutalist palette
        navy: {
          DEFAULT: "#033F63",
          light: "#1A5A80",
          pale: "#D6E8F2",
        },
        olive: {
          DEFAULT: "#697A21",
          light: "#8A9E35",
          pale: "#E8EDD0",
        },
        pink: {
          DEFAULT: "#FF5D73",
          light: "#FF8A9A",
          pale: "#FFE0E5",
        },
        gold: {
          DEFAULT: "#FFC914",
          light: "#FFD84D",
          pale: "#FFF3CC",
        },
        wine: {
          DEFAULT: "#450920",
          light: "#6B1535",
          pale: "#F0D4DC",
        },
        cream: {
          DEFAULT: "#FFFDF9",
          dark: "#F5F0E6",
        },
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
