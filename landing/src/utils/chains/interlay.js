import { capitalizeFirstLetter } from "@site/src/utils";

const value = "interlay";

export const interlay = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "INTR",
  decimals: 10,
};
