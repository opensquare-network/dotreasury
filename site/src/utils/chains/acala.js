import { capitalizeFirstLetter } from "../../utils";

const value = "acala";

export const acala = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "ACA",
  decimals: 12,
  hasSubscan: true,
};
