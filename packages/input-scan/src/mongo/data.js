const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";

// income collections
const incomeInflationCollectionName = "inflation";
const stakingSlashCollectionName = "slashStaking";
const treasurySlashCollectionName = "slashTreasury";
const electionSlashCollectionName = "slashElections";
const democracySlashCollectionName = "slashDemocracy";
const identitySlashCollectionName = "slashIdentity";
const othersIncomeCollectionName = "othersBig";
const incomeTransferCollectionName = "transfer";

// stats collections
const weeklyStatsCollectionName = "weeklyStats";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

// income collections
let statusCol = null;
let incomeInflationCol = null;
let stakingSlashCol = null;
let treasurySlashCol = null;
let electionsPhragmenSlashCol = null;
let democracySlashCol = null;
let identitySlashCol = null;
let referendaSlashCol = null;
let fellowshipReferendaSlashCol = null;
let othersIncomeCol = null;
let incomeTransferCol = null;

// for centrifuge income
let cfgBlockRewardCol = null;
let cfgTxFeeCol = null;

// stats collections
let weeklyStatsCol = null;
let periodCol = null; // spend periods

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  incomeInflationCol = db.collection(incomeInflationCollectionName);
  stakingSlashCol = db.collection(stakingSlashCollectionName);
  treasurySlashCol = db.collection(treasurySlashCollectionName);
  electionsPhragmenSlashCol = db.collection(electionSlashCollectionName);
  democracySlashCol = db.collection(democracySlashCollectionName);
  identitySlashCol = db.collection(identitySlashCollectionName);
  referendaSlashCol = db.collection("slashReferenda");
  fellowshipReferendaSlashCol = db.collection("slashFellowshipReferenda");
  othersIncomeCol = db.collection(othersIncomeCollectionName);
  incomeTransferCol = db.collection(incomeTransferCollectionName);
  weeklyStatsCol = db.collection(weeklyStatsCollectionName);
  periodCol = db.collection("period");
  cfgBlockRewardCol = db.collection("cfgBlockReward");
  cfgTxFeeCol = db.collection("cfgTxFee");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getIncomeInflationCollection() {
  await tryInit(incomeInflationCol);
  return incomeInflationCol;
}

async function getCfgBlockRewardCol() {
  await tryInit(cfgBlockRewardCol);
  return cfgBlockRewardCol;
}

async function getCfgTxFeeCol() {
  await tryInit(cfgTxFeeCol);
  return cfgTxFeeCol;
}

async function getStakingSlashCollection() {
  await tryInit(stakingSlashCol);
  return stakingSlashCol;
}

async function getTreasurySlashCollection() {
  await tryInit(treasurySlashCol);
  return treasurySlashCol;
}

async function getElectionSlashCollection() {
  await tryInit(electionsPhragmenSlashCol);
  return electionsPhragmenSlashCol;
}

async function getDemocracySlashCollection() {
  await tryInit(democracySlashCol);
  return democracySlashCol;
}

async function getIdentitySlashCollection() {
  await tryInit(identitySlashCol);
  return identitySlashCol;
}

async function getReferendaSlashCol() {
  await tryInit(referendaSlashCol);
  return referendaSlashCol;
}

async function getFellowshipReferendaSlashCol() {
  await tryInit(fellowshipReferendaSlashCol);
  return fellowshipReferendaSlashCol;
}

async function getOthersIncomeCollection() {
  await tryInit(othersIncomeCol);
  return othersIncomeCol;
}

async function getIncomeTransferCollection() {
  await tryInit(incomeTransferCol);
  return incomeTransferCol;
}

async function getWeeklyStatsCollection() {
  await tryInit(weeklyStatsCol);
  return weeklyStatsCol;
}

async function getPeriodCol() {
  await tryInit(periodCol);
  return periodCol;
}

async function closeDb() {
  if (client) {
    await client.close()
  }
}

module.exports = {
  getStatusCollection,
  getIncomeInflationCollection,
  getStakingSlashCollection,
  getTreasurySlashCollection,
  getElectionSlashCollection,
  getDemocracySlashCollection,
  getIdentitySlashCollection,
  getReferendaSlashCol,
  getFellowshipReferendaSlashCol,
  getOthersIncomeCollection,
  getIncomeTransferCollection,
  getWeeklyStatsCollection,
  getPeriodCol,
  getCfgBlockRewardCol,
  getCfgTxFeeCol,
  closeDb,
};
