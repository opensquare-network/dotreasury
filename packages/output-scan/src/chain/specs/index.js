const findLast = require("lodash.findlast");
const last = require("lodash.last");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getRegistryByHeight } = require("../registry");
const { isUseMetaDb, } = require("../../env");
const { getApi } = require("../../api");
const { default: upgrades } = require("@polkadot/types-known/upgrades");

let versionChangedHeights = [];
let registryMap = {};

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function updateSpecs() {
  if (isUseMetaDb()) {
    versionChangedHeights = await getAllVersionChangeHeights();
    return
  }

  const api = await getApi();
  const targetNetworkUpgrades = upgrades.find(upgrade => api.genesisHash.eq(upgrade.genesisHash));
  if (!targetNetworkUpgrades) {
    throw new Error("Can not find target upgrades");
  }

  versionChangedHeights = targetNetworkUpgrades.versions.map(({ blockNumber }) => blockNumber.toNumber());
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry(height) {
  let targetHeight;
  if (isUseMetaDb() && newHeight(height)) {
    targetHeight = height;
  } else {
    targetHeight = findLast(
      versionChangedHeights,
      (h) => h <= height
    );
    if (!targetHeight) {
      throw new Error(`Can not find height ${ height }`);
    }
  }

  let registry = registryMap[targetHeight];
  if (!registry) {
    registry = await getRegistryByHeight(targetHeight);
    if (isUseMetaDb()) {
      registryMap[targetHeight] = registry;
    }
  }

  return registry;
}

function newHeight(height) {
  return versionChangedHeights.length <= 0 || height > last(versionChangedHeights)
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
