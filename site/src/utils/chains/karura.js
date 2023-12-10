import { capitalizeFirstLetter } from "../../utils";

const value = "karura";

export const karura = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KAR",
  decimals: 12,
  hasSubscan: true,
};
