const { MongoClient } = require("mongodb");
const config = require("../../config");

const inputDbName = config.mongo.dotInputDbName || "dotreasury-input-dot";
const outputDbName = config.mongo.dotOutputDbName || "dotreasury-output-dot";

const statusCollectionName = "status";

// output collections
const tipCollectionName = "tip";
const proposalCollectionName = "proposal";
const bountyCollectionName = "bounty";
const motionCollectionName = "motion";
const referendumCollectionName = "democracyReferendum";
const burntCollectionName = "burnt";
const outputTransferCollectionName = "outputTransfer";

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
let inputDb = null;
let outputDb = null;

const mongoUrl = config.mongo.dotUrl || "mongodb://localhost:27017";
let statusCol = null;

let tipCol = null;
let proposalCol = null;
let bountyCol = null;
let childBountyCol = null;
let motionCol = null;
let referendumCol = null;
let burntCol = null;
let outputTransferCol = null;
let outputWeeklyStatsCol = null;
let outputStatusCol = null;

let incomeInflationCol = null;
let stakingSlashCol = null;
let treasurySlashCol = null;
let electionsPhragmenSlashCol = null;
let democracySlashCol = null;
let identitySlashCol = null;
let incomeTransferCol = null;
let othersIncomeCol = null;
let inputWeeklyStatsCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  inputDb = client.db(inputDbName);
  statusCol = inputDb.collection(statusCollectionName);
  incomeInflationCol = inputDb.collection(incomeInflationCollectionName);
  stakingSlashCol = inputDb.collection(stakingSlashCollectionName);
  treasurySlashCol = inputDb.collection(treasurySlashCollectionName);
  electionsPhragmenSlashCol = inputDb.collection(electionSlashCollectionName);
  democracySlashCol = inputDb.collection(democracySlashCollectionName);
  identitySlashCol = inputDb.collection(identitySlashCollectionName);
  incomeTransferCol = inputDb.collection(incomeTransferCollectionName);
  othersIncomeCol = inputDb.collection(othersIncomeCollectionName);
  inputWeeklyStatsCol = inputDb.collection(weeklyStatsCollectionName);

  outputDb = client.db(outputDbName);
  tipCol = outputDb.collection(tipCollectionName);
  proposalCol = outputDb.collection(proposalCollectionName);
  bountyCol = outputDb.collection(bountyCollectionName);
  childBountyCol = outputDb.collection("childBounty");
  motionCol = outputDb.collection(motionCollectionName);
  referendumCol = outputDb.collection(referendumCollectionName);
  burntCol = outputDb.collection(burntCollectionName);
  outputTransferCol = outputDb.collection(outputTransferCollectionName);
  outputWeeklyStatsCol = outputDb.collection(weeklyStatsCollectionName);
  outputStatusCol = outputDb.collection(statusCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!inputDb || !outputDb) {
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

async function getOutputStatusCollection() {
  await tryInit(outputStatusCol);
  return outputStatusCol;
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

async function getChildBountyCollection() {
  await tryInit(childBountyCol);
  return childBountyCol;
}

async function getMotionCollection() {
  await tryInit(motionCol);
  return motionCol;
}

async function getReferendumCollection() {
  await tryInit(referendumCol);
  return referendumCol;
}

async function getBurntCollection() {
  await tryInit(burntCol);
  return burntCol;
}

async function getOutputTransferCollection() {
  await tryInit(outputTransferCol);
  return outputTransferCol;
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

async function getIncomeTransferCollection() {
  await tryInit(incomeTransferCol);
  return incomeTransferCol;
}

async function getOthersIncomeCollection() {
  await tryInit(othersIncomeCol);
  return othersIncomeCol;
}

async function getInputWeeklyStatsCollection() {
  await tryInit(inputWeeklyStatsCol);
  return inputWeeklyStatsCol;
}

async function getOutputWeeklyStatsCollection() {
  await tryInit(outputWeeklyStatsCol);
  return outputWeeklyStatsCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getChildBountyCollection,
  getMotionCollection,
  getReferendumCollection,
  getBurntCollection,
  getOutputTransferCollection,
  getIncomeInflationCollection,
  getStakingSlashCollection,
  getTreasurySlashCollection,
  getElectionSlashCollection,
  getDemocracySlashCollection,
  getIdentitySlashCollection,
  getIncomeTransferCollection,
  getOthersIncomeCollection,
  getInputWeeklyStatsCollection,
  getOutputWeeklyStatsCollection,
  getOutputStatusCollection,
};
