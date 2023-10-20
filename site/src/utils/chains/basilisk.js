import { capitalizeFirstLetter } from "../../utils";

const value = "basilisk";

export const basilisk = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "BSX",
  decimals: 12,
};
