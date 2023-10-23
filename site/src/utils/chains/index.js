import { kusama } from "./kusama";
import { polkadot } from "./polkadot";
import { basilisk } from "./basilisk";
import { centrifuge } from "./centrifuge";
import { hydradx } from "./hydradx";
import { interlay } from "./interlay";
import { khala } from "./khala";
import { kintsugi } from "./kintsugi";
import { phala } from "./phala";
import { moonbeam } from "./moonbeam";
import { moonriver } from "./moonriver";

export const CHAIN = import.meta.env.VITE_APP_CHAIN;

export const CHAINS = {
  polkadot,
  kusama,
  basilisk,
  centrifuge,
  hydradx,
  interlay,
  khala,
  kintsugi,
  phala,
  moonriver,
  moonbeam,
};

export const CHAIN_SETTINGS = getChainSettings(CHAIN);

export const IS_CENTRIFUGE = CHAIN === CHAINS.centrifuge.value;

/**
 * @param {string} value
 * @returns {Partial<typeof kusama & typeof polkadot & typeof centrifuge>}
 */
export function getChainSettings(value = "") {
  return CHAINS[value] ?? {};
}
