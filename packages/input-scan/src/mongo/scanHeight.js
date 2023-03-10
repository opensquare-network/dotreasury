const { getStatusCollection } = require("./data");

const genesisHeight = 1;
const mainScanName = "income-scan";
const genesisIncomeSeats = {
  inflation: 0,
  slash: 0,
  transfer: 0,
  others: 0, // mainly gas
  slashSeats: {
    treasury: 0,
    staking: 0,
    democracy: 0,
    election: 0,
    identity: 0,
    referenda: 0,
    fellowshipReferenda: 0,
  },
};

async function getNextScanHeight() {
  const statusCol = await getStatusCollection();
  const status = await statusCol.findOne({ name: mainScanName });

  if (!status) {
    return genesisHeight;
  } else if (typeof status.height === "number") {
    return status.height + 1;
  } else {
    console.error("Scan height value error in DB!");
    process.exit(1);
  }
}

async function getNowIncomeSeats() {
  const statusCol = await getStatusCollection();
  const status = await statusCol.findOne({ name: mainScanName });

  if (!status) {
    return genesisIncomeSeats
  }

  return status.seats;
}

async function updateScanStatus(height, seats) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: mainScanName },
    { $set: { height, seats, } },
    { upsert: true }
  );
}

module.exports = {
  getNextScanHeight,
  getNowIncomeSeats,
  updateScanStatus,
};
