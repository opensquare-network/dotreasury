const { MongoClient } = require("mongodb");
const { currentChain } = require("../chain");

function getDbName() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return process.env.MONGO_DB_KSM_NAME || "dotreasury-ksm";
  } else {
    return process.env.MONGO_DB_DOT_NAME || "dotreasury-dot";
  }
}

const statusCollectionName = "status";
const tipCollectionName = "tip";
const motionCollectionName = "motion";
const bountyCollectionName = "bounty";
const proposalCollectionName = "proposal";
const burntCollectionName = "burnt";

// income collections
const incomeInflationCollectionName = "incomeInflation";
const stakingSlashCollectionName = "incomeSlashStaking";
const treasurySlashCollectionName = "incomeSlashTreasury";
const electionSlashCollectionName = "incomeSlashElections";
const democracySlashCollectionName = "incomeSlashDemocracy";
const identitySlashCollectionName = "incomeSlashIdentity";
const othersIncomeCollectionName = "incomeOthersBig";

// stats collections
const statsCollectionName = "weeklyStats";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let tipCol = null;
let bountyCol = null;
let proposalCol = null;
let motionCol = null;
let burntCol = null;
let incomeInflationCol = null;
let stakingSlashCol = null;
let treasurySlashCol = null;
let electionsPhragmenSlashCol = null;
let democracySlashCol = null;
let identitySlashCol = null;
let othersIncomeCol = null;
let statsCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  tipCol = db.collection(tipCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  motionCol = db.collection(motionCollectionName);
  burntCol = db.collection(burntCollectionName);
  incomeInflationCol = db.collection(incomeInflationCollectionName);
  stakingSlashCol = db.collection(stakingSlashCollectionName);
  treasurySlashCol = db.collection(treasurySlashCollectionName);
  electionsPhragmenSlashCol = db.collection(electionSlashCollectionName);
  democracySlashCol = db.collection(democracySlashCollectionName);
  identitySlashCol = db.collection(identitySlashCollectionName);
  othersIncomeCol = db.collection(othersIncomeCollectionName);
  statsCol = db.collection(statsCollectionName);

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

async function getMotionCollection() {
  await tryInit(statusCol);
  return motionCol;
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getProposalCollection() {
  await tryInit(proposalCol);
  return proposalCol;
}

async function getBurntCollection() {
  await tryInit(burntCol);
  return burntCol;
}

async function getIncomeInflationCollection() {
  await tryInit(incomeInflationCol);
  return incomeInflationCol;
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

async function getOthersIncomeCollection() {
  await tryInit(othersIncomeCol);
  return othersIncomeCol;
}

async function getStatsCollection() {
  await tryInit(statsCol);
  return statsCol;
}

module.exports = {
  getStatusCollection,
  getTipCollection,
  getBountyCollection,
  getProposalCollection,
  getMotionCollection,
  getBurntCollection,
  getIncomeInflationCollection,
  getStakingSlashCollection,
  getTreasurySlashCollection,
  getElectionSlashCollection,
  getDemocracySlashCollection,
  getIdentitySlashCollection,
  getOthersIncomeCollection,
  getStatsCollection,
};
