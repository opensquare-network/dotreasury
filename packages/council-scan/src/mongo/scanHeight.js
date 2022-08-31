const { getStatusCollection } = require("./index");
const isNil = require("lodash.isnil");
const {
  env: { currentChain }
} = require("@osn/scan-common");

const genesisHeight = 1;
const mainScanName = "council-scan";

const scanStartHeight = {
}

async function getNextScanHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: mainScanName });

  let result = genesisHeight;
  if (!heightInfo) {
    result = genesisHeight;
  } else if (typeof heightInfo.value === "number") {
    result = heightInfo.value + 1;
  } else {
    console.error("Scan height value error in DB!");
    process.exit(1);
  }

  const startHeight = scanStartHeight[currentChain()];
  if (!isNil(startHeight) && result < startHeight) {
    return startHeight;
  }

  return result;
}

async function updateScanHeight(height) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: mainScanName },
    { $set: { value: height } },
    { upsert: true }
  );
}

module.exports = {
  getNextScanHeight,
  updateScanHeight,
};
