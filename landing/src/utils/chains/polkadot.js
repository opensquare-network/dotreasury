import { capitalizeFirstLetter } from "../../../../site/src/utils";

const value = "polkadot";

export const polkadot = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "DOT",
  decimals: 10,
};
