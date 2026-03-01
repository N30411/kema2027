import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2f0",
          500: "#2d5978",
          600: "#1a3a52",
          700: "#0f2438",
          900: "#0a1628",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #0f2438 0%, #0a1628 100%)",
      },
    },
  },
  plugins: [],
}

export default config
