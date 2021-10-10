const findLast = require("lodash.findlast");
const { ksmHeights, dotHeights } = require("./known");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getRegistryByHeight } = require("../registry");
const { getApi } = require("../../api");
const { expandMetadata } = require("@polkadot/types");
const { isUseMetaDb, currentChain, CHAINS, } = require("../../env")

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
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${height}`);
  }

  let registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    registry = await getRegistryByHeight(mostRecentChangeHeight);
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}

async function findDecorated(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find height ${height}`);
  }

  let decorated = decoratedMap[mostRecentChangeHeight];
  if (!decorated) {
    const metadata = await getMetadataByHeight(height);
    decorated = expandMetadata(metadata.registry, metadata);
    decoratedMap[height] = decorated;
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
