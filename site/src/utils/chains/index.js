import { kusama } from "./kusama";
import { polkadot } from "./polkadot";
import { basilisk } from "./basilisk";
import { hydradx } from "./hydradx";
import { interlay } from "./interlay";
import { kintsugi } from "./kintsugi";
import { moonbeam } from "./moonbeam";
import { moonriver } from "./moonriver";
import { acala } from "./acala.js";
import { karura } from "./karura.js";
import { bifrost } from "./bifrostPolkadot.js";
import { astar } from "./astar";

export const currentChain = import.meta.env.VITE_APP_CHAIN;

export const CHAINS = {
  polkadot,
  kusama,
  basilisk,
  hydradx,
  interlay,
  kintsugi,
  moonriver,
  moonbeam,
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
