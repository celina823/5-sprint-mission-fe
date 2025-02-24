import type { Config } from "tailwindcss";

export default {
  content: [
    "./styles/global.css",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./global/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        Primary_100: "#3692FF",
        Primary_200: "#1697D6",
        Primary_300: "#1251AA",
        Error_red: "#F74747",
        gray_50: "#F9FAFB",
        gray_100: "#F3F4F6",
        gray_200: "#E5E7EB",
        gray_300: "#000000",
        gray_400: "#9CA3AF",
        gray_500: "#6B7280",
        gray_600: "#4B5563",
        gray_700: "#374151",
        gray_800: "#1F2937",
        gray_900: "#111827",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
