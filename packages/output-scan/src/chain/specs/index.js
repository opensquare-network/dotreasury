const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights, getScanHeight } = require("../../mongo/meta");
const { getApi, getProvider } = require("../../api");

let versionChangedHeights = [];
let metaScanHeight = 1;

function getMetaScanHeight() {
  return metaScanHeight;
}

// For test
async function setSpecHeights(heights = []) {
  const api = await getApi();
  for (const height of heights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const provider = getProvider()
    const runtimeVersion = await provider.send('chain_getRuntimeVersion', [blockHash]);
    versionChangedHeights.push({
      height,
      runtimeVersion,
    })
  }

  metaScanHeight = heights[heights.length - 1];
}

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
  metaScanHeight = await getScanHeight();
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry({ blockHash, blockHeight: height }) {
  const spec = findMostRecentSpec(height)
  const api = await getApi()
  return (await api.getBlockRegistry(blockHash, spec.runtimeVersion)).registry;
}

function findMostRecentSpec(height) {
  const spec = findLast(
    versionChangedHeights,
    (h) => h.height <= height
  );
  if (!spec) {
    throw new Error(`Can not find height ${ height }`);
  }

  return spec
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
  getMetaScanHeight,
};
