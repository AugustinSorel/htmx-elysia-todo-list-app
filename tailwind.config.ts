import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      padding: {
        "max-width": "max(calc((100vw - var(--max-width)) / 2), 1rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
