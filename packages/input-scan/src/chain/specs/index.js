const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getApi } = require("../../api");

let versionChangedHeights = [];

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
}

async function updateSpecs(toScanHeight) {
  versionChangedHeights = await getAllVersionChangeHeights();
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

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry({ blockHash, blockHeight: height }) {
  const spec = findMostRecentSpec(height)
  const api = await getApi()
  return (await api.getBlockRegistry(blockHash, spec.runtimeVersion)).registry;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
