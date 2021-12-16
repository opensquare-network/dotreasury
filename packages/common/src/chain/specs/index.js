const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights, getScanHeight } = require("../../mongo/meta");
const { getApi, getProvider } = require("../api");
const { logger } = require("../../logger");
const { hexToU8a, isHex } = require("@polkadot/util");

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
  let u8aHash = blockHash;
  if (isHex(blockHash)) {
    u8aHash = hexToU8a(u8aHash);
  }

  const spec = findMostRecentSpec(height)
  const api = await getApi()
  return (await api.getBlockRegistry(u8aHash, spec.runtimeVersion)).registry;
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

function checkSpecs() {
  const specHeights = getSpecHeights();
  if (specHeights.length <= 0 || specHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    throw "No specHeights or invalid";
  }
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
  getMetaScanHeight,
  checkSpecs,
};
