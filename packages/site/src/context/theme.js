import { createContext, useState } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  useTheme as useStyledTheme,
} from "styled-components";
import { light } from "../styles/theme/light";
import { dark } from "../styles/theme/dark";

// TODO: read from cookie
const defaultThemeMode = "light";
const ThemeModeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(defaultThemeMode);
  const theme = themeMode === "light" ? light : dark;

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
    </ThemeModeContext.Provider>
  );
}

/**
 * @returns {typeof light}
 * @description type friendly alternative to `styled.useTheme`
 */
export function useTheme() {
  return useStyledTheme();
}

export function useDark() {
  return useTheme().dark;
}
