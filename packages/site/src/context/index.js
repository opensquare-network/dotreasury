import { ThemeProvider } from "./theme";

export function GlobalProvider({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
