const findLast = require("lodash.findlast");
const last = require("lodash.last");
const { ksmHeights, dotHeights } = require("./known");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getRegistryByHeight } = require("../registry");
const { getApi } = require("../../api");
const { isUseMetaDb, currentChain, CHAINS, } = require("../../env")

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

  const chain = currentChain();
  if (CHAINS.KUSAMA === chain) {
    versionChangedHeights = ksmHeights;
  } else if (CHAINS.POLKADOT === chain) {
    versionChangedHeights = dotHeights;
  }
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

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
