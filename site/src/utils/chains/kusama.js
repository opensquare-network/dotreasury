import { capitalizeFirstLetter } from "@site/src/utils";

const value = "kusama";

export const kusama = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KSM",
  decimals: 12,
  supportOpenGov: true,
  hasDotreasury: true,
};
