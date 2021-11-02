const findLast = require("lodash.findlast");
const last = require("lodash.last");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getRegistryByHeight } = require("../registry");
const { getApi } = require("../../api");
const { expandMetadata } = require("@polkadot/types");
const { isUseMetaDb, } = require("../../env")
const { default: upgrades } = require("@polkadot/types-known/upgrades");

let versionChangedHeights = [];
let registryMap = {};
let decoratedMap = {};

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

async function getMetadataByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return api.rpc.state.getMetadata(blockHash);
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

async function findDecorated(height) {
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

  let decorated = decoratedMap[targetHeight];
  if (!decorated) {
    const metadata = await getMetadataByHeight(height);
    decorated = expandMetadata(metadata.registry, metadata);
    if (isUseMetaDb()) {
      decoratedMap[height] = decorated;
    }
  }

  return decorated;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  findDecorated,
  setSpecHeights,
};
