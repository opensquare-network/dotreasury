import { capitalizeFirstLetter } from "@site/src/utils";

const value = "phala";

export const phala = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "PHA",
  decimals: 12,
};
