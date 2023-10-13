import { capitalizeFirstLetter } from "@site/src/utils";

const value = "moonbeam";

export const moonbeam = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "GLMR",
  decimals: 18,
};
