const { CHAINS } = require("./chains");

const tokens = Object.freeze({
  DOT: "DOT",
  KSM: "KSM",
  KAR: "KAR",
  BNC: "BNC",
  HDX: "HDX",
  ACA: "ACA",
  ASTR: "ASTR",
});

const ChainTokenMap = Object.freeze({
  [CHAINS.polkadot]: tokens.DOT,
  [CHAINS.kusama]: tokens.KSM,
  [CHAINS.hydradx]: tokens.HDX,
  [CHAINS.acala]: tokens.ACA,
  [CHAINS.karura]: tokens.KAR,
  [CHAINS.bifrost]: tokens.BNC,
  [CHAINS.astar]: tokens.ASTR,
});

const gateTokenIdMap = Object.freeze({});

// Kraken symbol format for ccxt (e.g. DOT/USD)
const krakenTokenIdMap = Object.freeze({
  [tokens.DOT]: "DOT/USD",
  [tokens.KSM]: "KSM/USD",
  [tokens.ACA]: "ACA/USD",
  [tokens.BNC]: "BNC/USD",
  [tokens.HDX]: "HDX/USD",
  [tokens.ASTR]: "ASTR/USD",
});

// CoinGecko coin IDs for tokens not available on Kraken
const coingeckoTokenIdMap = Object.freeze({
  [tokens.KAR]: "karura",
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

const revertCoingeckoTokenIdMap = Object.entries(coingeckoTokenIdMap).reduce(
  (result, [key, value]) => {
    return { ...result, [value]: key };
  },
  {},
);

module.exports = {
  tokens,
  gateTokenIdMap,
  krakenTokenIdMap,
  coingeckoTokenIdMap,
  revertGateTokenIdMap,
  revertKrakenTokenIdMap,
  revertCoingeckoTokenIdMap,
  ChainTokenMap,
  CHAINS,
};
