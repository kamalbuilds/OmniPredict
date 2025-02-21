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
        darker: "#353535",
        'neon-pink': '#ff71ce',
        'neon-blue': '#01cdfe',
        'neon-green': '#05ffa1',
        'dark-purple': '#1a0f2e',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        xxs: "0.6rem",
      },
      screens: {
        tablet: "940px",
        galaxy: "480px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "retro-gradient": "linear-gradient(45deg, var(--neon-pink), var(--neon-blue))",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 10px var(--neon-pink)' },
          'to': { textShadow: '0 0 20px var(--neon-pink), 0 0 30px var(--neon-pink)' },
        },
        flicker: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '0.35' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
