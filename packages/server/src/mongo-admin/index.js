const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_ADMIN_NAME || "dotreasury-admin";

const linkCollectionName = "link";
const userCollectionName = "user";
const commentCollectionName = "comment";
const reactionCollectionName = "reaction";
const attemptCollectionName = "attempt";
const rateCollectionName = "rate";
const descriptionCollectionName = "description";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
let linkCol = null;
let userCol = null;
let commentCol = null;
let reactionCol = null;
let attemptCol = null;
let rateCol = null;
let descriptionCol = null;

// Funded projects related
let projectCol = null;
let projectFundCol = null; // the fund items for projects, including proposals, tips, bounties, child bounties.

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  linkCol = db.collection(linkCollectionName);
  userCol = db.collection(userCollectionName);
  commentCol = db.collection(commentCollectionName);
  reactionCol = db.collection(reactionCollectionName);
  attemptCol = db.collection(attemptCollectionName);
  rateCol = db.collection(rateCollectionName);
  descriptionCol = db.collection(descriptionCollectionName);

  projectCol = db.collection("project");
  projectFundCol = db.collection("projectFund");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  userCol.createIndex({ username: 1 }, { unique: true });
  userCol.createIndex({ email: 1 }, { unique: true });
  userCol.createIndex({ kusamaAddress: 1 }, { unique: true, sparse: true });
  userCol.createIndex({ polkadotAddress: 1 }, { unique: true, sparse: true });

  reactionCol.createIndex({ commentId: 1, userId: 1 }, { unique: true });
  reactionCol.createIndex({ commentId: 1, reaction: 1 });

  attemptCol.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

  commentCol.createIndex({ indexer: 1, createdAt: 1 });

  linkCol.createIndex({ indexer: 1 });
  descriptionCol.createIndex({ indexer: 1 });

  rateCol.createIndex({ indexer: 1, createdAt: -1 });
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

async function getDescriptionCollection() {
  await tryInit(descriptionCol);
  return descriptionCol;
}

async function getUserCollection() {
  await tryInit(userCol);
  return userCol;
}

async function getCommentCollection() {
  await tryInit(commentCol);
  return commentCol;
}

async function getReactionCollection() {
  await tryInit(reactionCol);
  return reactionCol;
}

async function getAttemptCollection() {
  await tryInit(attemptCol);
  return attemptCol;
}

async function getRateCollection() {
  await tryInit(rateCol);
  return rateCol;
}

async function getProjectCollection() {
  await tryInit(projectCol);
  return projectCol;
}

async function getProjectFundCollection() {
  await tryInit(projectFundCol);
  return projectFundCol;
}

function withTransaction(fn, options) {
  return client.withSession((session) => {
    return session.withTransaction(fn, options);
  });
}

module.exports = {
  initDb,
  withTransaction,
  getLinkCollection,
  getDescriptionCollection,
  getUserCollection,
  getCommentCollection,
  getReactionCollection,
  getAttemptCollection,
  getRateCollection,
  getProjectCollection,
  getProjectFundCollection,
};
