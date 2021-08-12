const { getAllVersionChangeHeights } = require("../meta");
const { getRegistryByHeight } = require("../../utils/registry");
const findLast = require("lodash.findlast");

let versionChangedHeights = [];
let registryMap = {};

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
  for (const height of versionChangedHeights) {
    if (registryMap[height]) {
      continue;
    }

    registryMap[height] = await getRegistryByHeight(height);
  }
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

  const registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    await updateSpecs();
  }

  return registryMap[mostRecentChangeHeight];
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
};
