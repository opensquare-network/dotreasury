const { getAllVersionChangeHeights } = require("../meta");
const { getRegistryByHeight } = require("../../utils/registry");
const findLast = require("lodash.findlast");
const { getApi } = require("../../api");
const { expandMetadata } = require("@polkadot/types");

let versionChangedHeights = [];
let registryMap = {};
let decoratedMap = {};

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
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
    const registry = await findRegistry(height);
    decorated = expandMetadata(registry, metadata);
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
