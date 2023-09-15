import { kusama } from "./kusama";
import { polkadot } from "./polkadot";

export const CHAINS = {
  kusama,
  polkadot,
};

export function getChainSettings(value = "") {
  return CHAINS[value] ?? {};
}
