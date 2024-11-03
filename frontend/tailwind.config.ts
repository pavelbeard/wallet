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
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0%)" },
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
        "slide-down": {
          "0%": {
            height: "0rem",
          },
          "10%": {
            height: "2rem",
          },
          "20%": {
            height: "4rem",
          },
          "30%": {
            height: "6rem",
          },
          "40%": {
            height: "8rem",
          },
          "50%": {
            height: "10rem",
          },
          "60%": {
            height: "12rem",
          },
          "70%": {
            height: "14rem",
          },
          "80%": {
            height: "16rem",
          },
          "90%": {
            height: "18rem",
          },
          "100%": {
            height: "20rem",
          },
        },
        "slide-up": {
          "0%": {
            height: "20rem",
          },
          "10%": {
            height: "18rem",
          },
          "20%": {
            height: "16rem",
          },
          "30%": {
            height: "14rem",
          },
          "40%": {
            height: "12rem",
          },
          "50%": {
            height: "10rem",
          },
          "60%": {
            height: "8rem",
          },
          "70%": {
            height: "6rem",
          },
          "80%": {
            height: "4rem",
          },
          "90%": {
            height: "2rem",
          },
          "100%": {
            height: "0rem",
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
        }
      },
      animation: {
        appear: "appear 1s ease-in-out",
        slide: "slide 0.5s ease-in-out",
        "slide-reverse": "slide-reverse 750ms ease-in-out",
        "slide-down": "slide-down 250ms ease-in-out",
        "slide-up": "slide-up 250ms ease-in-out",
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
};
export default config;
