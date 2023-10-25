import { capitalizeFirstLetter } from "../../utils";

const value = "centrifuge";

export const centrifuge = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "CFG",
  decimals: 18,
  ss58Format: 36,
  hasDotreasury: true,
  hasSubscan: true,

  hasTips: false,
  hasBounties: false,
  hasTransfers: false,
  hasBurnt: false,

  blockTime: 12000,

  ui: {
    totalStacked: {
      yStepSize: 3000000,
    },
  },
};
