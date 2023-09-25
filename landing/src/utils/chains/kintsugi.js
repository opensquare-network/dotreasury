import { capitalizeFirstLetter } from "@site/src/utils";

const value = "kintsugi";

export const kintsugi = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KINT",
  decimals: 12,
};
