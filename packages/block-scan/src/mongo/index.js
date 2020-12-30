const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_NAME || "dotreasury";

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  eventCol = db.collection(eventCollectionName);
  extrinsicCol = db.collection(extrinsicCollectionName);

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



module.exports = {
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
};
