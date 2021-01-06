const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_NAME || "dotreasury";

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const tipCollectionName = "tip";
const motionCollectionName = "motion";
const bountyCollectionName = "bounty";
const bountyTimelineCollectionName = "bountyTimeline";
const proposalCollectionName = "proposal";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let tipCol = null;
let bountyCol = null;
let bountyTimelineCol = null;
let proposalCol = null;
let motionCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  eventCol = db.collection(eventCollectionName);
  extrinsicCol = db.collection(extrinsicCollectionName);
  tipCol = db.collection(tipCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  bountyTimelineCol = db.collection(bountyTimelineCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  motionCol = db.collection(motionCollectionName);

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

async function getBlockCollection() {
  await tryInit(blockCol);
  return blockCol;
}

async function getExtrinsicCollection() {
  await tryInit(extrinsicCol);
  return extrinsicCol;
}

async function getEventCollection() {
  await tryInit(eventCol);
  return eventCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getBountyTimelineCollection() {
  await tryInit(bountyTimelineCol);
  return bountyTimelineCol;
}

async function getProposalCollection() {
  await tryInit(proposalCol);
  return proposalCol;
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getTipCollection,
  getBountyCollection,
  getBountyTimelineCollection,
  getProposalCollection,
  getMotionCollection,
};
