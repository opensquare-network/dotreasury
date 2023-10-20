import { capitalizeFirstLetter } from "../../utils";

const value = "moonriver";

export const moonriver = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "MOVR",
  decimals: 18,
};
