import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import {
  createGlobalStyle,
  ThemeProvider as Provider,
} from "styled-components";
import { light, dark } from "../styles/theme";
import { useLocalStorage } from "../utils/hooks";
import { usePreferredColorScheme } from "../hooks/usePreferredColorScheme";

const themes = { light, dark };

/**
 * @typedef {'system'|'light'|'dark'} ThemeMode
 * @typedef {(mode: ThemeMode) => void} SetThemeMode
 * @typedef {typeof light} Theme
 * @typedef {{mode: ThemeMode, setMode: SetThemeMode, theme: Theme} ThemeContext
 */

/** @type {React.Context<ThemeContext>} */
const ThemeContext = createContext({});

const GlobalThemeVars = createGlobalStyle`
  :root {${(p) => p.vars}}
`;

/**
 * @description a part of noflash
 */
function RootClassListEffect() {
  const dark = useDark();
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return null;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage("theme-mode", "system");
  const preferredColorScheme = usePreferredColorScheme();

  const theme = useMemo(
    () => (mode === "system" ? themes[preferredColorScheme] : themes[mode]),
    [mode, preferredColorScheme],
  );
  const themeVars = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme }}>
      <GlobalThemeVars vars={themeVars} />
      <RootClassListEffect />
      <Provider theme={theme}>{children}</Provider>
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

/**
 * @description shortcut for `useThemeMode().mode === 'dark'`
 */
export function useDark() {
  const { mode } = useContext(ThemeContext);
  const preferredColorScheme = usePreferredColorScheme();
  if (mode !== "system") {
    return mode === "dark";
  }
  return preferredColorScheme === "dark";
}

/**
 * @returns {[ThemeMode, SetThemeMode]}
 */
export function useThemeMode() {
  const { mode, setMode } = useContext(ThemeContext);
  return [mode, setMode];
}
