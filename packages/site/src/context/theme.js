import React, { createContext, useState, useContext } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { light, dark } from "../styles/theme";

/**
 * @typedef {'light'|'dark'} Mode
 * @typedef {(mode: Mode) => void} SetMode
 * @typedef {typeof light} Theme
 * @typedef {{mode: Mode, setMode: SetMode, theme: Theme} ThemeContext
 */

// TODO: read from cookie
const defaultThemeMode = "light";
/** @type {React.Context<ThemeContext>} */
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
 * @returns {Theme}
 * @description type friendly alternative to styled `useTheme`
 */
export function useTheme() {
  return useContext(ThemeContext).theme;
}

// TODO: read preferred color scheme
/**
 * @description shortcut for `useThemeMode().mode === 'dark'`
 */
export function useDark() {
  const { mode } = useContext(ThemeContext);
  return mode === "dark";
}

/**
 * @returns {[mode, setMode]}
 */
export function useThemeMode() {
  const { mode, setMode } = useContext(ThemeContext);
  return [mode, setMode];
}

// TODO: 1. preferred color scheme, 2. light, 3. dark
export function useToggleThemeMode() {
  const [, setMode] = useThemeMode();
  const dark = useDark();

  function toggleThemeMode() {
    setMode(dark ? "light" : "dark");
  }

  return toggleThemeMode;
}
