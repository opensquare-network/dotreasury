const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_NAME || "dotreasury";

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const tipCollectionName = "tip";
const tipStateCollectionName = "tipState";
const bountyCollectionName = "bounty";
const bountyStateCollectionName = "bountyState";
const proposalCollectionName = "proposal";
const proposalStateCollectionName = "proposalState";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let tipCol = null;
let tipStateCol = null;
let bountyCol = null;
let bountyStateCol = null;
let proposalCol = null;
let proposalStateCol = null;

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
  tipStateCol = db.collection(tipStateCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  bountyStateCol = db.collection(bountyStateCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  proposalStateCol = db.collection(proposalStateCollectionName);

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

async function getTipStateCollection() {
  await tryInit(tipStateCol);
  return tipStateCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getBountyStateCollection() {
  await tryInit(bountyStateCol);
  return bountyStateCol;
}

async function getProposalCollection() {
  await tryInit(proposalCol);
  return proposalCol;
}

async function getProposalStateCollection() {
  await tryInit(proposalStateCol);
  return proposalStateCol;
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getTipCollection,
  getTipStateCollection,
  getBountyCollection,
  getBountyStateCollection,
  getProposalCollection,
  getProposalStateCollection,
};
