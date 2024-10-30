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
        "short-slide-to-right": {
          from: { transform: "translateX(-1.5%)" },
          to: { transform: "translateX(0%)" },
        },
        "medium-slide-to-right": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0%)" },
        },
        "medium-slide-to-left": {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        "medium-slide-from-far-right-to-right": {
          from: { transform: "translateX(200%)" },
          to: { transform: "translateX(100%)" },
        },
        "medium-slide-from-right-to-far-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(200%)" },
        },
      },
      animation: {
        appear: "appear 1s ease-in-out",
        slide: "slide 0.5s ease-in-out",
        "slide-reverse": "slide-reverse 750ms ease-in-out",
        "slide-down": "slide-down 250ms ease-in-out",
        "slide-up": "slide-up 250ms ease-in-out",
        "short-slide-to-right": "short-slide-to-right 100ms ease-in-out",
        "medium-slide-to-right": "medium-slide-to-right 500ms ease-in-out",
        "medium-slide-to-left": "medium-slide-to-left 500ms ease-in-out",
        "medium-slide-from-far-right-to-right": "medium-slide-from-far-right-to-right 500ms ease-in-out",
        "medium-slide-from-right-to-far-right": "medium-slide-from-right-to-far-right 500ms ease-in-out",
      },
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
