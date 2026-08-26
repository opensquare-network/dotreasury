import { kusama } from "./kusama";
import { polkadot } from "./polkadot";
import { hydradx } from "./hydradx";
import { acala } from "./acala.js";
import { karura } from "./karura.js";
import { bifrost } from "./bifrostPolkadot.js";
import { astar } from "./astar";

export const currentChain = import.meta.env.VITE_APP_CHAIN;

export const CHAINS = {
  polkadot,
  kusama,
  hydradx,
  acala,
  karura,
  bifrost,
  astar,
};

export const currentChainSettings = getChainSettings(currentChain);

export const isPolkadot = currentChain === CHAINS.polkadot.value;
export const isKusama = currentChain === CHAINS.kusama.value;

/**
 * @param {string} value
 * @returns {Partial<typeof kusama & typeof polkadot>}
 */
export function getChainSettings(value = "") {
  return CHAINS[value] ?? {};
}
