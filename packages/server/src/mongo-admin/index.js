const { MongoClient } = require("mongodb");
const config = require("../../config");

const dbName = config.mongo.adminDbName || "dotreasury-admin";

const linkCollectionName = "link";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let linkCol = null;


async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  linkCol = db.collection(linkCollectionName);

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

async function getLinkCollection() {
  await tryInit(linkCol);
  return linkCol;
}

module.exports = {
  initDb,
  getLinkCollection,
};
