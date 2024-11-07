import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        grey_s: "#666669",
        blue_s: "#A2D2FF",
        purple_s: "#8C52FF",
        green: "#2DCE89",
        yellow: "#FFC107",
        red: "#E63946",
      },
    },
  },
  plugins: [],
};
export default config;
