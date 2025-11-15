import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ 클래스 기반 테마 전환
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
