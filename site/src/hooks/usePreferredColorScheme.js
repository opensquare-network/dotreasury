import { useMediaQuery } from "usehooks-ts";

export function usePreferredColorScheme() {
  const dark = useMediaQuery("(prefers-color-scheme: dark)");
  return dark ? "dark" : "light";
}
