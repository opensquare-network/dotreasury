const { getStatusCollection } = require("./index");
const { asyncLocalStorage } = require("./utils");

const genesisHeight = 1;
const mainScanName = "main-scan-height";
const incomeScanName = "income-scan";
const genesisTreasurySeats = {
  inflation: 0,
  slash: 0,
  others: 0, // mainly gas
  slashSeats: {
    treasury: 0,
    staking: 0,
    democracy: 0,
    electionsPhragmen: 0,
    identity: 0,
  },
};

async function getNextScanHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: mainScanName });

  if (!heightInfo) {
    return genesisHeight;
  } else if (typeof heightInfo.value === "number") {
    return heightInfo.value + 1;
  } else {
    console.error("Scan height value error in DB!");
    process.exit(1);
  }
}

async function getIncomeNextScanStatus() {
  const statusCol = await getStatusCollection();
  const status = await statusCol.findOne({ name: incomeScanName });

  if (!status) {
    return {
      height: genesisHeight,
      seats: genesisTreasurySeats,
    };
  }

  return status;
}

async function updateScanHeight(height) {
  const session = asyncLocalStorage.getStore();
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: mainScanName },
    { $set: { value: height } },
    { upsert: true, session }
  );
}

async function updateIncomeScanStatus(height, seats) {
  const session = asyncLocalStorage.getStore();
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: incomeScanName },
    { $set: { height, seats } },
    { upsert: true, session }
  );
}

module.exports = {
  getNextScanHeight,
  updateScanHeight,
  getIncomeNextScanStatus,
  updateIncomeScanStatus,
};
