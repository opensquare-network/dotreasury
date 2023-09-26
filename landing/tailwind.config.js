import { light } from "../site/src/styles/theme";

/**
 * `light.neutral100` -> `{ neutral100: 'var(--neutral100)' }`
 */
const twThemeVariables = Object.keys(light).reduce((value, key) => {
  value[key] = `var(--${key})`;
  return value;
}, {});

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      pad: "1080px",
    },
    extend: {
      colors: {
        ...twThemeVariables,
      },
    },
  },
  plugins: [],
};
