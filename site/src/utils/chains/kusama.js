import { capitalizeFirstLetter } from "../../utils";

const value = "kusama";

export const kusama = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KSM",
  decimals: 12,
  supportOpenGov: true,
  hasDotreasury: true,

  hasOutputPeriods: true,

  hasTips: true,
  hasBounties: true,
  hasTransfers: true,
  hasBurnt: true,
};
