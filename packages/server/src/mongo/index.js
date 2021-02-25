const { MongoClient } = require("mongodb");
const config = require("../../config");

const dbName = config.mongo.dbName || "dotreasury";

const statusCollectionName = "status";
const tipCollectionName = "tip";
const proposalCollectionName = "proposal";
const bountyCollectionName = "bounty";
const motionCollectionName = "motion";
const burntCollectionName = "burnt";

// income collections
const incomeInflationCollectionName = "incomeInflation";
const stakingSlashCollectionName = "incomeSlashStaking";
const treasurySlashCollectionName = "incomeSlashTreasury";
const electionSlashCollectionName = "incomeSlashElections";
const democracySlashCollectionName = "incomeSlashDemocracy";
const identitySlashCollectionName = "incomeSlashIdentity";

// stats collections
const statsCollectionName = "weeklyStats";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let tipCol = null;
let proposalCol = null;
let bountyCol = null;
let motionCol = null;
let burntCol = null;
let incomeInflationCol = null;
let stakingSlashCol = null;
let treasurySlashCol = null;
let electionsPhragmenSlashCol = null;
let democracySlashCol = null;
let identitySlashCol = null;
let statsCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  tipCol = db.collection(tipCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  motionCol = db.collection(motionCollectionName);
  burntCol = db.collection(burntCollectionName);
  incomeInflationCol = db.collection(incomeInflationCollectionName);
  stakingSlashCol = db.collection(stakingSlashCollectionName);
  treasurySlashCol = db.collection(treasurySlashCollectionName);
  electionsPhragmenSlashCol = db.collection(electionSlashCollectionName);
  democracySlashCol = db.collection(democracySlashCollectionName);
  identitySlashCol = db.collection(identitySlashCollectionName);
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

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getProposalCollection() {
  await tryInit(proposalCol);
  return proposalCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getMotionCollection() {
  await tryInit(motionCol);
  return motionCol;
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

async function getStatsCollection() {
  await tryInit(statsCol);
  return statsCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getMotionCollection,
  getBurntCollection,
  getIncomeInflationCollection,
  getStakingSlashCollection,
  getTreasurySlashCollection,
  getElectionSlashCollection,
  getDemocracySlashCollection,
  getIdentitySlashCollection,
  getStatsCollection,
};
