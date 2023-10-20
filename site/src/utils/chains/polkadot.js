import { capitalizeFirstLetter } from "../../utils";

const value = "polkadot";

export const polkadot = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "DOT",
  decimals: 10,
  supportOpenGov: true,
  hasDotreasury: true,
};
