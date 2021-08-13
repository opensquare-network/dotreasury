const { getAllVersionChangeHeights } = require("../meta");
const { getRegistryByHeight } = require("../../utils/registry");
const findLast = require("lodash.findlast");

let versionChangedHeights = [];
let registryMap = {};

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
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

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
};
