import { createContext, useState, useContext } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { light, dark } from "../styles/theme";

// TODO: read from cookie
const defaultThemeMode = "light";
const ThemeContext = createContext({});

const GlobalThemeVars = createGlobalStyle`
  :root {${(p) => p.vars}}
`;

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(defaultThemeMode);
  const theme = mode === "light" ? light : dark;
  const themeVars = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme }}>
      <GlobalThemeVars vars={themeVars} />
      {/* NOTE: useless, cuz we use css vars, keep it for safe DX */}
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
    </ThemeContext.Provider>
  );
}

/**
 * @returns {typeof light}
 * @description type friendly alternative to styled `useTheme`
 */
export function useTheme() {
  return useContext(ThemeContext).theme;
}

// TODO: read preferred color scheme
export function useDark() {
  const { mode } = useContext(ThemeContext);
  return mode === "dark";
}
