/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./styles/global.css",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./global/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#3692FF",
          200: "#1697D6",
          300: "#1251AA",
        },
        error: "#F74747",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#000000",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: { // ✅ colors 밖으로 이동
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
