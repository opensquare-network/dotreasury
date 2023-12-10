import { capitalizeFirstLetter } from "../../utils";

const value = "bifrost";

export const bifrost = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "BNC",
  decimals: 12,
  hasSubscan: true,
};
