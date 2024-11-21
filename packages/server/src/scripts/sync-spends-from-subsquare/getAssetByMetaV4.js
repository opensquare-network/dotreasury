const { AssetHubParaChainId, MythosParaChainId } = require("./consts");
const { KnownPolkadotAssetHubAssets, MYTH } = require("./knownAssets");

function getParachainIdV4(location) {
  const { parents, interior } = location || {};
  if (parents !== 0) {
    return null;
  }
  return interior?.x1?.[0]?.parachain;
}

function isLocationFromRelayToPara(location = {}, parachainId) {
  const { parents, interior } = location || {};
  return parents === 0 && interior?.x1?.[0]?.parachain === parachainId;
}

function isLocationFromParaToPara(location = {}, parachainId) {
  const { parents, interior } = location || {};
  return parents === 1 && interior?.x1?.[0]?.parachain === parachainId;
}

function isLocationFromRelayToAssetHub(location = {}) {
  return isLocationFromRelayToPara(location, AssetHubParaChainId);
}

function isLocationFromParaToAssetHub(location = {}) {
  return isLocationFromParaToPara(location, AssetHubParaChainId);
}

function isLocationFromRelayToMythos(location = {}) {
  return isLocationFromRelayToPara(location, MythosParaChainId);
}

function isLocationFromParaToMythos(location = {}) {
  return isLocationFromParaToPara(location, MythosParaChainId);
}

function _isAssetHubX2(assetId = {}) {
  const { parents, interior } = assetId || {};
  if (parents !== 0) {
    return false;
  }
  const x2 = interior?.x2;
  return x2 && Array.isArray(x2);
}

function isNativeAsset(assetId = {}) {
  const { parents, interior } = assetId || {};
  return parents === 1 && "here" in interior;
}

function getAssetHubAsset(assetId = {}) {
  if (isNativeAsset(assetId)) {
    return KnownPolkadotAssetHubAssets.find((asset) => asset.type === "native");
  }
  if (!_isAssetHubX2(assetId)) {
    return null;
  }
  const x2 = assetId?.interior?.x2;
  if (x2[0]?.palletInstance !== 50) {
    return null;
  }
  return KnownPolkadotAssetHubAssets.find(
    (asset) => asset.assetId === x2[1]?.generalIndex,
  );
}

function getMythosAsset(assetId = {}) {
  if (!isNativeAsset(assetId)) {
    return null;
  }
  return MYTH;
}

function getAssetByMetaV4(v4 = {}) {
  const { location, assetId } = v4;
  if (
    isLocationFromRelayToAssetHub(location) ||
    isLocationFromParaToAssetHub(location)
  ) {
    return getAssetHubAsset(assetId);
  }

  if (
    isLocationFromRelayToMythos(location) ||
    isLocationFromParaToMythos(location)
  ) {
    return getMythosAsset(assetId);
  }

  return null;
}

module.exports = {
  getAssetByMetaV4,
  getParachainIdV4,
};
