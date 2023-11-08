import { capitalizeFirstLetter } from "../../utils";

const value = "polkadot";

export const polkadot = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "DOT",
  decimals: 10,
  ss58Format: 0,
  supportOpenGov: true,
  hasDotreasury: true,
  hasPolkascan: true,
  hasSubscan: true,
  hasStatescan: true,

  hasProjects: true,
  hasOutputPeriods: true,

  hasStaking: true,
  hasTips: true,
  hasBounties: true,
  hasTransfers: true,
  hasBurnt: true,
};
