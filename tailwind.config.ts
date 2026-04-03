import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        monospace: ["var(--font-mono)"],
      },
      colors: {
        lime: {
          600: "#65a30d",
          700: "#4d7c0f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
