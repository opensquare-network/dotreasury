import { CHAINS } from "../constants";

export const CHAIN = import.meta.env.VITE_APP_CHAIN;

export const IS_KUSAMA = CHAIN === CHAINS.KUSAMA;
export const IS_POLKADOT = CHAIN === CHAINS.POLKADOT;
export const IS_CENTRIFUGE = CHAIN === CHAINS.CENTRIFUGE;

export const IS_SUPPORT_OPEN_GOV = [CHAINS.KUSAMA, CHAINS.POLKADOT].includes(
  CHAIN,
);
