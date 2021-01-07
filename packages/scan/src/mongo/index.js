const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_NAME || "dotreasury";

const statusCollectionName = "status";
const tipCollectionName = "tip";
const motionCollectionName = "motion";
const bountyCollectionName = "bounty";
const proposalCollectionName = "proposal";
const burntCollectionName = "burnt";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let tipCol = null;
let bountyCol = null;
let proposalCol = null;
let motionCol = null;
let burntCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  tipCol = db.collection(tipCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  motionCol = db.collection(motionCollectionName);
  burntCol = db.collection(burntCollectionName);

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

module.exports = {
  getStatusCollection,
  getTipCollection,
  getBountyCollection,
  getProposalCollection,
  getMotionCollection,
  getBurntCollection,
};
