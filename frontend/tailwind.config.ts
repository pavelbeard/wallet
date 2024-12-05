import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        appear: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        slide: {
          from: { transform: "translateX(25%)", opacity: "0" },
          to: { transform: "translateX(0%)", opacity: "100" },
        },
        "slide-reverse": {
          from: {
            transform: "translateX(0%)",
            opacity: "0",
          },
          to: {
            transform: "translateX(100%)",
            opacity: "100",
          },
        },
        "short-slide-out-right": {
          from: { transform: "translateX(-1.5%)" },
          to: { transform: "translateX(0%)" },
        },
        "short-slide-in-right": {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-1.5%)" },
        },
        "short-slide-out-left": {
          from: { transform: "translateX(-1.5%)", opacity: "0" },
          to: { transform: "translateX(0%)", opacity: "100" },
        },
        "short-slide-in-left": {
          from: { transform: "translateX(0%)", opacity: "100" },
          to: { transform: "translateX(-1.5%)", opacity: "0" },
        },
        "medium-slide-to-right": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0%)" },
        },
        "medium-slide-to-left": {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        "medium-slide-in-right": {
          from: { transform: "translateX(150%)" },
          to: { transform: "translateX(100%)" },
        },
        "medium-slide-out-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(150%)" },
        },
        "short-expand": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "100" },
        },
        "short-collapse": {
          from: { transform: "scale(1)", opacity: "100" },
          to: { transform: "scale(0.9)", opacity: "0" },
        },
      },
      animation: {
        appear: "appear 0.5s ease-in-out",
        slide: "slide 0.5s ease-in-out",
        "slide-reverse": "slide-reverse 750ms ease-in-out",
        "short-slide-in-right": "short-slide-in-right 100ms ease-in-out",
        "short-slide-out-right": "short-slide-out-right 100ms ease-in-out",
        "short-slide-in-left": "short-slide-in-left 100ms ease-in-out",
        "short-slide-out-left": "short-slide-out-left 100ms ease-in-out",
        "medium-slide-to-right": "medium-slide-to-right 500ms ease-in-out",
        "medium-slide-to-left": "medium-slide-to-left 500ms ease-in-out",
        "medium-slide-in-right": "medium-slide-in-right 500ms ease-in-out",
        "medium-slide-out-right": "medium-slide-out-right 500ms ease-in-out",
        "short-expand": "short-expand 200ms ease-in-out",
        "short-collapse": "short-collapse 200ms ease-in-out",
      },
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};
export default config;
