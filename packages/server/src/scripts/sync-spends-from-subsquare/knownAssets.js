const { MythosParaChainId } = require("./consts");

const KnownPolkadotAssetHubAssets = [
  {
    type: "native",
    symbol: "DOT",
    decimals: 10,
  },
  {
    type: "asset",
    assetId: 1984,
    symbol: "USDt",
    decimals: 6,
  },
  {
    type: "asset",
    assetId: 1337,
    symbol: "USDC",
    decimals: 6,
  },
  {
    type: "asset",
    assetId: 30,
    symbol: "DED",
    decimals: 10,
  },
];

const MYTH = {
  type: "parachain-native",
  parachainId: MythosParaChainId,
  symbol: "MYTH",
  decimals: 18,
};

module.exports = {
  KnownPolkadotAssetHubAssets,
  MYTH,
};
