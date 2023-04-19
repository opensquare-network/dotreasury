// usage css3 variables
// `color: var(--textPrimary);`
// `background-color: var(--neutral100);`

export const light = {
  primary: "var(--pink500)",
  secondary: "var(--pink100)",

  textPrimary: "rgba(0, 0, 0, 0.9)",
  textSecondary: "rgba(0, 0, 0, 0.65)",
  textTertiary: "rgba(0, 0, 0, 0.3)",
  textDisable: "rgba(0, 0, 0, 0.15)",
  textPrimaryContrast: "rgba(255, 255, 255, 1)",
  textSecondaryContrast: "rgba(255, 255, 255, 0.8)",

  pink100: "rgba(255, 240, 243, 1)",
  pink200: "rgba(255, 197, 206, 1)",
  pink300: "rgba(252, 124, 145, 1)",
  pink400: "rgba(248, 82, 110, 1)",
  pink500: "rgba(242, 50, 82, 1)",
  yellow100: "rgba(255, 242, 217, 1)",
  yellow200: "rgba(254, 224, 165, 1)",
  yellow300: "rgba(252, 207, 117, 1)",
  yellow400: "rgba(248, 191, 77, 1)",
  yellow500: "rgba(242, 177, 47, 1)",
  orange100: "rgba(255, 238, 230, 1)",
  orange300: "rgba(252, 169, 124, 1)",
  orange500: "rgba(242, 117, 50, 1)",
  purple500: "rgba(99, 95, 236, 1)",
  green100: "rgba(230, 255, 238, 1)",
  green500: "rgba(14, 171, 14, 1)",
  red100: "rgba(255, 230, 230, 1)",
  red500: "rgba(233, 11, 11, 1)",
  blue500: "rgba(8, 109, 227, 1)",
  neutral100: "rgba(255, 255, 255, 1)",
  neutral200: "rgba(250, 250, 250, 1)",
  neutral300: "rgba(244, 244, 244, 1)",
  neutral400: "rgba(221, 221, 221, 1)",
  neutral500: "rgba(204, 204, 204, 1)",

  shadow100: "0px 1px 4px rgba(0, 0, 0, 0.02), 0px 2px 8px rgba(0, 0, 0, 0.02)",
  shadow200:
    " 0px 1px 8px rgba(0, 0, 0, 0.04), 0px 4px 16px rgba(0, 0, 0, 0.08)",
};

export const dark = {
  ...light,

  textPrimary: "rgba(255, 255, 255, 0.90)",
  textSecondary: "rgba(255, 255, 255, 0.80)",
  textTertiary: "rgba(255, 255, 255, 0.45)",
  textDisable: "rgba(255, 255, 255, 0.30)",
  textPrimaryContrast: "rgba(255, 255, 255, 0.90)",
  textSecondaryContrast: "rgba(255, 255, 255, 0.80)",

  pink100: "rgba(49, 8, 15, 1)",
  pink200: "rgba(113, 1, 21, 1)",
  pink300: "rgba(148, 11, 34, 1)",
  pink400: "rgba(184, 30, 55, 1)",
  pink500: "rgba(218, 31, 62, 1)",
  yellow100: "rgba(51, 34, 0, 1)",
  yellow200: "rgba(123, 83, 2, 1)",
  yellow300: "rgba(199, 136, 11, 1)",
  yellow400: "rgba(230, 162, 26, 1)",
  yellow500: "rgba(242, 177, 47, 1)",
  orange100: "rgba(52, 25, 10, 1)",
  orange300: "rgba(145, 70, 30, 1)",
  orange500: "rgba(207, 98, 40, 1)",
  purple500: "rgba(83, 80, 220, 1)",
  green100: "rgba(6, 44, 6, 1)",
  green500: "rgba(23, 144, 23, 1)",
  red100: "rgba(60, 10, 10, 1)",
  red500: "rgba(214, 34, 34, 1)",
  blue500: "rgba(26, 107, 201, 1)",
  neutral100: "rgba(0, 0, 0, 1)",
  neutral200: "rgba(15, 15, 15, 1)",
  neutral300: "rgba(31, 31, 31, 1)",
  neutral400: "rgba(51, 51, 51, 1)",
  neutral500: "rgba(82, 82, 82, 1)",
};
