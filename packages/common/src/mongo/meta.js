const { MongoClient } = require("mongodb");
const omit = require("lodash.omit");

function getDbName() {
  const dbName = process.env.MONGO_DB_META_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_META_NAME not set");
  }

  return dbName;
}

const blockCollectionName = "block";
const statusCollectionName = "status";
const versionCollectionName = "version";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let statusCol = null;
let blockCol = null;
let versionCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  versionCol = db.collection(versionCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await blockCol.createIndex({ height: -1 }, { unique: true });
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

async function getVersionCollection() {
  await tryInit(versionCol);
  return versionCol;
}

async function getAllVersionChangeHeights() {
  const col = await getVersionCollection();
  const versions = await col.find({}).sort({ height: 1 }).toArray();

  return (versions || []).map(v => {
    return {
      height: v.height,
      runtimeVersion: {
        ...(omit(v.runtimeVersion, ['apis']))
      }
    }
  });
}

async function getBlocks(startHeight, endHeight) {
  const col = await getBlockCollection();
  return await col
    .find({
      $and: [
        { height: { $gte: startHeight } },
        { height: { $lte: endHeight } },
      ],
    })
    .sort({ height: 1 })
    .toArray();
}

async function getBlocksByHeights(heights = []) {
  if (heights.length <= 0) {
    return []
  }

  const col = await getBlockCollection();
  return await col.find({
    height: { $in: heights }
  }).sort({ height: 1 }).toArray();
}

async function getScanHeight() {
  const col = await getStatusCollection()
  const status = await col.findOne({ name: 'main-scan-height' })

  return status?.value || 1
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getBlocks,
  getBlocksByHeights,
  getAllVersionChangeHeights,
  getScanHeight,
};
