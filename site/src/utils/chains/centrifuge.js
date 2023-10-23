import { capitalizeFirstLetter } from "../../utils";

const value = "centrifuge";

export const centrifuge = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "CFG",
  decimals: 18,
  hasDotreasury: true,

  hasTips: false,
  hasBounties: false,
  hasTransfers: false,
  hasBurnt: false,

  ui: {
    totalStacked: {
      yStepSize: 3000000,
    },
  },
};
