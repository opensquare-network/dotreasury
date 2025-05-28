const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_NAME not set");
  }

  return dbName;
}

let client = null;
let db = null;

const statusCollectionName = "status";
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
let statusCol = null;
let priceCol = null;
let treasuryHistoryCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl);

  const dbName = getDbName();
  db = client.db(dbName);

  statusCol = db.collection(statusCollectionName);
  priceCol = db.collection("price");
  treasuryHistoryCol = db.collection("treasuryHistory");

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

async function getStatusCol() {
  await tryInit(statusCol);
  return statusCol;
}

async function getPriceCol() {
  await tryInit(priceCol);
  return priceCol;
}

async function getTreasuryHistoryCol() {
  await tryInit(treasuryHistoryCol);
  return treasuryHistoryCol;
}

async function close() {
  if (client) {
    await client.close();
  }
}

module.exports = {
  getStatusCol,
  close,
  getPriceCol,
  getTreasuryHistoryCol,
};
