const { MongoClient } = require("mongodb");
const config = require("../../config");

const inputDbName = config.mongo.dotInputDbName || "dotreasury-input-dot";
const outputDbName = config.mongo.dotOutputDbName || "dotreasury-output-dot";
const councilDbName = config.mongo.dotCouncilDbName || "dotreasury-council-dot";

const statusCollectionName = "status";

// output collections
const tipCollectionName = "tip";
const proposalCollectionName = "proposal";
const bountyCollectionName = "bounty";
const childBountyCollectionName = "childBounty";
const motionCollectionName = "motion";
const referendumCollectionName = "democracyReferendum";
const tipFinderCollectionName = "tipFinder";
const proposalBeneficiaryCollectionName = "proposalBeneficiary";
const burntCollectionName = "burnt";
const outputTransferCollectionName = "outputTransfer";
const participantCollectionName = "participant";
const motionVoterCollectionName = "motionVoter";
const tipperCollectionName = "tipper";
const referendaReferendumCollectionName = "referendaReferendum";

// income collections
const incomeInflationCollectionName = "inflation";
const stakingSlashCollectionName = "slashStaking";
const treasurySlashCollectionName = "slashTreasury";
const electionSlashCollectionName = "slashElections";
const democracySlashCollectionName = "slashDemocracy";
const identitySlashCollectionName = "slashIdentity";
const othersIncomeCollectionName = "othersBig";
const incomeTransferCollectionName = "transfer";

// council collections
const termsCollectionName = "terms";
const termCouncilorCollectionName = "termCouncilor";

// stats collections
const weeklyStatsCollectionName = "weeklyStats";

let client = null;
let inputDb = null;
let outputDb = null;
let councilDb = null;

const mongoUrl = config.mongo.dotUrl || "mongodb://127.0.0.1:27017";
let statusCol = null;

let referendaReferendumCol = null;
let tipCol = null;
let proposalCol = null;
let bountyCol = null;
let childBountyCol = null;
let motionCol = null;
let referendumCol = null;
let tipFinderCol = null;
let proposalBeneficiaryCol = null;
let burntCol = null;
let outputTransferCol = null;
let outputWeeklyStatsCol = null;
let outputStatusCol = null;
let participantCol = null;
let motionVoterCol = null;
let tipperCol = null;

let incomeInflationCol = null;
let stakingSlashCol = null;
let treasurySlashCol = null;
let electionsPhragmenSlashCol = null;
let democracySlashCol = null;
let identitySlashCol = null;
let incomeTransferCol = null;
let othersIncomeCol = null;
let inputWeeklyStatsCol = null;

let termsCol = null;
let termCouncilorCol = null;
let councilStatusCol = null;

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
  referendaReferendumCol = outputDb.collection(referendaReferendumCollectionName);
  tipCol = outputDb.collection(tipCollectionName);
  proposalCol = outputDb.collection(proposalCollectionName);
  bountyCol = outputDb.collection(bountyCollectionName);
  childBountyCol = outputDb.collection(childBountyCollectionName);
  motionCol = outputDb.collection(motionCollectionName);
  referendumCol = outputDb.collection(referendumCollectionName);
  tipFinderCol = outputDb.collection(tipFinderCollectionName);
  proposalBeneficiaryCol = outputDb.collection(proposalBeneficiaryCollectionName);
  burntCol = outputDb.collection(burntCollectionName);
  outputTransferCol = outputDb.collection(outputTransferCollectionName);
  outputWeeklyStatsCol = outputDb.collection(weeklyStatsCollectionName);
  outputStatusCol = outputDb.collection(statusCollectionName);
  participantCol = outputDb.collection(participantCollectionName);
  motionVoterCol = outputDb.collection(motionVoterCollectionName);
  tipperCol = outputDb.collection(tipperCollectionName);

  councilDb = client.db(councilDbName);
  termsCol = councilDb.collection(termsCollectionName);
  termCouncilorCol = councilDb.collection(termCouncilorCollectionName);
  councilStatusCol = councilDb.collection(statusCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!inputDb || !outputDb) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
  motionVoterCol.createIndex({
    motionHash: 1,
    motionHeight: 1,
    voter: 1,
  });

  tipperCol.createIndex({
    tipHash: 1,
    tipHeight: 1,
    tipper: 1,
  });
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

async function getReferendaReferendumCollection() {
  await tryInit(referendaReferendumCol);
  return referendaReferendumCol;
};

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

async function getTipFinderCollection() {
  await tryInit(tipFinderCol);
  return tipFinderCol;
}

async function getProposalBeneficiaryCollection() {
  await tryInit(proposalBeneficiaryCol);
  return proposalBeneficiaryCol;
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

async function getParticipantCollection() {
  await tryInit(participantCol);
  return participantCol;
}

async function getTermsCollection() {
  await tryInit(termsCol);
  return termsCol;
}

async function getTermCouncilorCollection() {
  await tryInit(termCouncilorCol);
  return termCouncilorCol;
}

async function getCouncilStatusCol() {
  await tryInit(councilStatusCol);
  return councilStatusCol;
}

async function getMotionVoterCollection() {
  await tryInit(motionVoterCol);
  return motionVoterCol;
}

async function getTipperCollection() {
  await tryInit(tipperCol);
  return tipperCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getReferendaReferendumCollection,
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getChildBountyCollection,
  getMotionCollection,
  getReferendumCollection,
  getTipFinderCollection,
  getProposalBeneficiaryCollection,
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
  getParticipantCollection,
  getTermsCollection,
  getTermCouncilorCollection,
  getMotionVoterCollection,
  getTipperCollection,
  getCouncilStatusCol,
};
