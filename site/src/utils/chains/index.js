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

/**
 * @param {string} value
 * @returns {Partial<typeof CHAINS['kusama'] & typeof CHAINS['polkadot'] & typeof CHAINS['centrifuge']>}
 */
export function getChainSettings(value = "") {
  return CHAINS[value] ?? {};
}

export function isSupportOpenGov(chain = "") {
  return [kusama.value, polkadot.value].includes(chain);
}
