import { capitalizeFirstLetter } from "@site/src/utils";

const value = "moonriver";

export const moonriver = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "MOVR",
  decimals: 18,
};
