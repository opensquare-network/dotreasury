import { capitalizeFirstLetter } from "../../utils";

const value = "moonbeam";

export const moonbeam = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "GLMR",
  decimals: 18,
};
