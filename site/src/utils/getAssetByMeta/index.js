import getAssetByMetaV3 from "./getAssetByMetaV3";
import getAssetByMetaV4 from "./getAssetByMetaV4";

export const KnownPolkadotAssetHubAssets = [
  {
    type: "native",
    symbol: "DOT",
    decimals: 10,
  },
  {
    type: "asset",
    assetId: 1984,
    symbol: "USDT",
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

export default function getAssetByMeta(meta = {}, chainSettings) {
  const { v3, v4 } = meta?.assetKind || {};
  if (v3) {
    return getAssetByMetaV3(v3);
  } else if (v4) {
    return getAssetByMetaV4(v4);
  } else if (!meta?.assetKind) {
    const { symbol, decimals } = chainSettings;
    return {
      type: "native",
      symbol,
      decimals,
    };
  }
  return null;
}
