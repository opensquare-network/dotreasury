import { capitalizeFirstLetter } from "../../utils";

const value = "kintsugi";

export const kintsugi = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KINT",
  decimals: 12,
  hasSubscan: true,
};
