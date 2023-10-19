import { CHAINS } from "../constants";
import { getChainSettings } from "./chains";

export const CHAIN = import.meta.env.VITE_APP_CHAIN;

export const CHAIN_SETTINGS = getChainSettings(CHAIN);

export const IS_KUSAMA = CHAIN === CHAINS.KUSAMA;
export const IS_POLKADOT = CHAIN === CHAINS.POLKADOT;
export const IS_CENTRIFUGE = CHAIN === CHAINS.CENTRIFUGE;
