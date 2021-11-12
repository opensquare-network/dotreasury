const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_KNOWN_HEIGHTS_NAME
  if (!dbName) {
    throw new Error("no MONGO_DB_KNOWN_HEIGHTS_NAME set")
  }

  return dbName;
}

const heightCollectionName = "height";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let heightCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  heightCol = db.collection(heightCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await heightCol.createIndex({ height: 1 }, { unique: true });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getHeightCollection() {
  await tryInit(heightCol);
  return heightCol;
}

async function closeKnownClient() {
  await client.close()
}

module.exports = {
  getHeightCollection,
  closeKnownClient,
}
