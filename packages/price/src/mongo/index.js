const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_PRICE_NAME || "price";

const ksmUsdtCollectionName = "ksmUsdt";
const dotUsdtCollectionName = "dotUsdt";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
let ksmUsdtCol = null;
let dotUsdtCol = null;
let cfgUsdtCol = null;
let mythUsdtCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  ksmUsdtCol = db.collection(ksmUsdtCollectionName);
  dotUsdtCol = db.collection(dotUsdtCollectionName);
  cfgUsdtCol = db.collection("cfgUsdt");
  mythUsdtCol = db.collection("mythUsdt");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  ksmUsdtCol.createIndex({ openTime: 1 });
  dotUsdtCol.createIndex({ openTime: 1 });
  cfgUsdtCol.createIndex({ openTime: 1 });
  mythUsdtCol.createIndex({ openTime: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getKsmUsdtCollection() {
  await tryInit(ksmUsdtCol);
  return ksmUsdtCol;
}

async function getDotUsdtCollection() {
  await tryInit(dotUsdtCol);
  return dotUsdtCol;
}

async function getCfgUsdtCol() {
  await tryInit(cfgUsdtCol);
  return cfgUsdtCol;
}

async function getMythUsdtCol() {
  await tryInit(mythUsdtCol);
  return mythUsdtCol;
}

module.exports = {
  initDb,
  getKsmUsdtCollection,
  getDotUsdtCollection,
  getCfgUsdtCol,
  getMythUsdtCol,
};
