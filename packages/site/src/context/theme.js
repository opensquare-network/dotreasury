import { createContext, useState, useContext } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { light } from "../styles/theme/light";
import { dark } from "../styles/theme/dark";

// TODO: read from cookie
const defaultThemeMode = "light";
const ThemeModeContext = createContext(null);

const GlobalThemeVars = createGlobalStyle`
  :root {${(p) => p.vars}}
`;

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(defaultThemeMode);
  const theme = themeMode === "light" ? light : dark;
  const themeVars = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      <GlobalThemeVars vars={themeVars} />
      {/* NOTE: useless, cuz we use css vars, keep it for safe DX */}
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
    </ThemeModeContext.Provider>
  );
}

// TODO: read preferred color scheme
export function useDark() {
  const { themeMode } = useContext(ThemeModeContext);
  return themeMode === "dark";
}
