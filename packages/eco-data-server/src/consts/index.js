const { CHAINS } = require("./chains");

const tokens = Object.freeze({
  DOT: "DOT",
  KSM: "KSM",
  GLMR: "GLMR",
  CFG: "CFG",
  RING: "RING",
  KAR: "KAR",
  BNC: "BNC",
  TEER: "TEER",
  INTR: "INTR",
  KINT: "KINT",
  HDX: "HDX",
  BSX: "BSX",
  PHA: "PHA",
  ACA: "ACA",
  MOVR: "MOVR",
  MYTH: "MYTH",
  ASTR: "ASTR",
});

const ChainTokenMap = Object.freeze({
  [CHAINS.polkadot]: tokens.DOT,
  [CHAINS.kusama]: tokens.KSM,
  [CHAINS.centrifuge]: tokens.CFG,
  [CHAINS.khala]: tokens.PHA,
  [CHAINS.phala]: tokens.PHA,
  [CHAINS.basilisk]: tokens.BSX,
  [CHAINS.hydradx]: tokens.HDX,
  [CHAINS.interlay]: tokens.INTR,
  [CHAINS.kintsugi]: tokens.KINT,
  [CHAINS.acala]: tokens.ACA,
  [CHAINS.karura]: tokens.KAR,
  [CHAINS.bifrost]: tokens.BNC,
  [CHAINS.darwinia]: tokens.RING,
  [CHAINS.integritee]: tokens.TEER,
  [CHAINS.moonbeam]: tokens.GLMR,
  [CHAINS.moonriver]: tokens.MOVR,
  [CHAINS.astar]: tokens.ASTR,
});

const gateTokenIdMap = Object.freeze({
  [tokens.DOT]: "DOT/USDT",
  [tokens.KSM]: "KSM/USDT",
  [tokens.ACA]: "ACA/USDT",
  [tokens.MOVR]: "MOVR/USDT",
  [tokens.CFG]: "CFG/USDT",
  [tokens.GLMR]: "GLMR/USDT",
  [tokens.RING]: "RING/USDT",
  [tokens.KAR]: "KAR/USDT",
  [tokens.BNC]: "BNC/USDT",
  [tokens.TEER]: "TEER/USDT",
  [tokens.INTR]: "INTR/USDT",
  [tokens.KINT]: "KINT/USDT",
  [tokens.PHA]: "PHA/USDT",
  [tokens.MYTH]: "MYTH/USDT",
});

const krakenTokenIdMap = Object.freeze({
  [tokens.HDX]: "HDX/USD",
  [tokens.BSX]: "BSX/USD",
  [tokens.ASTR]: "ASTR/USD",
});

const revertGateTokenIdMap = Object.entries(gateTokenIdMap).reduce(
  (result, [key, value]) => {
    return { ...result, [value]: key };
  },
  {},
);

const revertKrakenTokenIdMap = Object.entries(krakenTokenIdMap).reduce(
  (result, [key, value]) => {
    return { ...result, [value]: key };
  },
  {},
);

module.exports = {
  tokens,
  gateTokenIdMap,
  krakenTokenIdMap,
  revertGateTokenIdMap,
  revertKrakenTokenIdMap,
  ChainTokenMap,
  CHAINS,
};
