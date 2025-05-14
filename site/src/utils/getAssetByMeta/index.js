import getAssetByMetaV3 from "./getAssetByMetaV3";
import getAssetByMetaV4 from "./getAssetByMetaV4";

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
