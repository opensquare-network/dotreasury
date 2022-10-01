const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME
  if (!dbName) {
    throw new Error("no MONGO_DB_NAME set")
  }

  return dbName;
}

const tipCollectionName = "tip";
const motionCollectionName = "motion";
const bountyCollectionName = "bounty";
const proposalCollectionName = "proposal";
const burntCollectionName = "burnt";
const outTransferColName = "outputTransfer";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
let tipCol = null;
let tipperCol = null;
let bountyCol = null;
let childBountyCol = null;
let proposalCol = null;
let motionCol = null;
let motionVoterCol = null;
let burntCol = null;
let outTransferCol = null;
let democracyReferendumCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName()
  console.log('dbName:', dbName);
  db = client.db(dbName);
  tipCol = db.collection(tipCollectionName);
  tipperCol = db.collection("tipper");
  bountyCol = db.collection(bountyCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  motionCol = db.collection(motionCollectionName);
  motionVoterCol = db.collection("motionVoter");
  burntCol = db.collection(burntCollectionName);
  outTransferCol = db.collection(outTransferColName);
  childBountyCol = db.collection("childBounty");
  democracyReferendumCol = db.collection("democracyReferendum");

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
  await tryInit(motionCol);
  return motionCol;
}

async function getMotionVoterCollection() {
  await tryInit(motionVoterCol);
  return motionVoterCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getTipperCollection() {
  await tryInit(tipperCol);
  return tipperCol;
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

async function getChildBountyCollection() {
  await tryInit(childBountyCol);
  return childBountyCol;
}

async function getOutTransferCollection() {
  await tryInit(outTransferCol);
  return outTransferCol;
}

async function getDemocracyReferendumCollection() {
  await tryInit(democracyReferendumCol);
  return democracyReferendumCol;
}

async function closeDataDbClient() {
  await client.close()
}

module.exports = {
  getTipCollection,
  getTipperCollection,
  getBountyCollection,
  getProposalCollection,
  getMotionCollection,
  getMotionVoterCollection,
  getBurntCollection,
  getOutTransferCollection,
  closeDataDbClient,
  getChildBountyCollection,
  getDemocracyReferendumCollection,
};
