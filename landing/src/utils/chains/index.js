import { kusama } from "./kusama";
import { polkadot } from "./polkadot";
import { basilisk } from "./basilisk";
import { centrifuge } from "./centrifuge";
import { hydradx } from "./hydradx";
import { interlay } from "./interlay";
import { khala } from "./khala";
import { kintsugi } from "./kintsugi";
import { phala } from "./phala";
import { moonbeam } from "src/utils/chains/moonbeam.js";
import { moonriver } from "src/utils/chains/moonriver.js";

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

export function getChainSettings(value = "") {
  return CHAINS[value] ?? {};
}

export function isSupportOpenGov(chain = "") {
  return [kusama.value, polkadot.value].includes(chain);
}
