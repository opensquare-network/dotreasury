const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const termsCollectionName = "terms";

let client = null;
let db = null;

let statusCol = null;
let termsCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName()
  console.log('dbName', dbName);
  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  termsCol = db.collection(termsCollectionName);

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

async function getTermsCollection() {
  await tryInit(termsCol);
  return termsCol;
}

async function close() {
  if (client) {
    await client.close();
  }
}

module.exports = {
  closeDb: close,
  getStatusCollection,
  getTermsCollection,
}
