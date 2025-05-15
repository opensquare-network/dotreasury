import { KnownPolkadotAssetHubAssets } from "../../constants";

export function getParachainIdV3(location) {
  const { parents, interior } = location || {};
  if (parents !== 0) {
    return null;
  }
  return interior?.x1?.parachain;
}

function isLocationFromRelayToAssetHub(location = {}) {
  const { parents, interior } = location || {};
  return parents === 0 && interior?.x1?.parachain === 1000;
}

function isLocationFromParaToAssetHub(location = {}) {
  const { parents, interior } = location || {};
  return parents === 1 && interior?.x1?.parachain === 1000;
}

function _isAssetHubX2(assetId = {}) {
  const { parents, interior } = assetId?.concrete || {};
  if (parents !== 0) {
    return false;
  }
  const x2 = interior?.x2;
  return x2 && Array.isArray(x2);
}

function isNativeAsset(assetId = {}) {
  const { parents, interior } = assetId?.concrete || {};
  return parents === 1 && "here" in interior;
}

function getAssetHubAsset(assetId = {}) {
  if (isNativeAsset(assetId)) {
    return KnownPolkadotAssetHubAssets.find((asset) => asset.type === "native");
  }
  if (!_isAssetHubX2(assetId)) {
    return null;
  }
  const x2 = assetId?.concrete?.interior?.x2;
  if (x2[0]?.palletInstance !== 50) {
    return null;
  }
  return KnownPolkadotAssetHubAssets.find(
    (asset) => asset.assetId === x2[1]?.generalIndex,
  );
}

export default function getAssetByMetaV3(v3 = {}) {
  const { location, assetId } = v3;
  if (
    !isLocationFromRelayToAssetHub(location) &&
    !isLocationFromParaToAssetHub(location)
  ) {
    return null;
  }
  return getAssetHubAsset(assetId);
}
