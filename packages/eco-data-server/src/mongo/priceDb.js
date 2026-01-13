const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_PRICE_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_PRICE_NAME not set");
  }

  return dbName;
}

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

let ksmUsdtCol = null;
let dotUsdtCol = null;
let cfgUsdtCol = null;
let mythUsdtCol = null;

async function initClient() {
  if (!client) {
    client = await MongoClient.connect(mongoUrl);
  }
}

async function initDb() {
  await initClient();

  const dbName = getDbName();
  db = client.db(dbName);

  ksmUsdtCol = db.collection("ksmUsdt");
  dotUsdtCol = db.collection("dotUsdt");
  cfgUsdtCol = db.collection("cfgUsdt");
  mythUsdtCol = db.collection("mythUsdt");

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

async function getPriceHistoryCol(symbol) {
  if (symbol === "KSM") {
    return await getKsmUsdtCollection();
  }
  if (symbol === "DOT") {
    return await getDotUsdtCollection();
  }
  if (symbol === "CFG") {
    return await getCfgUsdtCol();
  }
  if (symbol === "MYTH") {
    return await getMythUsdtCol();
  }

  throw new Error("Unsupported symbol: " + symbol);
}

module.exports = {
  getKsmUsdtCollection,
  getDotUsdtCollection,
  getCfgUsdtCol,
  getMythUsdtCol,
  getPriceHistoryCol,
};
