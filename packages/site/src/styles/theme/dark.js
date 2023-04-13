import { light } from "./light";

export const dark = {
  ...light,

  textPrimary: "rgba(255, 255, 255, 0.9)",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  textTertiary: "rgba(255, 255, 255, 0.3)",
  textDisable: "rgba(255, 255, 255, 0.15)",
  textPrimaryContrast: "var(--textPrimary)",

  shadow100: "0px 2px 8px rgba(0, 0, 0, 0.02), 0px 1px 4px rgba(0, 0, 0, 0.02)",
};
