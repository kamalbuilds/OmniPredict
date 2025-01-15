import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        perfect: "Perfect",
        digi: "Digi",
      },
      colors: {
        lemon: "#FFF500",
        viol: "#EDC6FF",
        light: "#3F80CD",
        dark: "#272E29",
        rose: "#FF002F",
        sea: "#ADA4FD",
        ocean: "#82B8FF",
        sun: "#FFFE4C",
        dBlue: "#0008FF",
        gris: "#CDD5DA",
        electric: "#00FF70",
        darker: "#353535"
      },
      fontSize: {
        xxs: "0.6rem",
      },
      screens: {
        tablet: "940px",
        galaxy: "480px",
      },
    },
  },
  plugins: [],
} satisfies Config;
