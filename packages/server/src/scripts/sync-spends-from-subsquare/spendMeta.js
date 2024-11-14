const { getAssetByMetaV3, getParachainIdV3 } = require("./getAssetByMetaV3");
const { getAssetByMetaV4, getParachainIdV4 } = require("./getAssetByMetaV4");

function getParachainIdByMeta(meta = {}) {
  const { v3, v4 } = meta?.assetKind || {};
  if (v3) {
    return getParachainIdV3(v3.location);
  } else if (v4) {
    return getParachainIdV4(v4.location);
  }
  return null;
}

function getAssetByMeta(meta = {}) {
  const { v3, v4 } = meta?.assetKind || {};
  if (v3) {
    return getAssetByMetaV3(v3);
  } else if (v4) {
    return getAssetByMetaV4(v4);
  }
  return null;
}

module.exports = {
  getParachainIdByMeta,
  getAssetByMeta,
};
