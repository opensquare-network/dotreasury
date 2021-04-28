const polkadot = require("./polkadot");
const kusama = require("./kusama");

const db = (chain) =>
  chain === "kusama" ? kusama : chain === "polkadot" ? polkadot : null;

function initDb() {
  return Promise.all([polkadot.initDb(), kusama.initDb()]);
}

function getStatusCollection(chain) {
  return db(chain).getStatusCollection();
}

function getTipCollection(chain) {
  return db(chain).getTipCollection();
}

function getProposalCollection(chain) {
  return db(chain).getProposalCollection();
}

function getBountyCollection(chain) {
  return db(chain).getBountyCollection();
}

function getMotionCollection(chain) {
  return db(chain).getMotionCollection();
}

function getBurntCollection(chain) {
  return db(chain).getBurntCollection();
}

function getOutputTransferCollection(chain) {
  return db(chain).getOutputTransferCollection();
}

function getIncomeInflationCollection(chain) {
  return db(chain).getIncomeInflationCollection();
}

function getStakingSlashCollection(chain) {
  return db(chain).getStakingSlashCollection();
}

function getTreasurySlashCollection(chain) {
  return db(chain).getTreasurySlashCollection();
}

function getElectionSlashCollection(chain) {
  return db(chain).getElectionSlashCollection();
}

function getDemocracySlashCollection(chain) {
  return db(chain).getDemocracySlashCollection();
}

function getIdentitySlashCollection(chain) {
  return db(chain).getIdentitySlashCollection();
}

function getIncomeTransferCollection(chain) {
  return db(chain).getIncomeTransferCollection();
}

function getOthersIncomeCollection(chain) {
  return db(chain).getOthersIncomeCollection();
}

function getWeeklyStatsCollection(chain) {
  return db(chain).getWeeklyStatsCollection();
}

module.exports = {
  initDb,
  getStatusCollection,
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getMotionCollection,
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
  getWeeklyStatsCollection,
};
