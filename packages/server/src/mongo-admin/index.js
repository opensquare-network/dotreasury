const { MongoClient } = require("mongodb");
const config = require("../../config");

const dbName = config.mongo.adminDbName || "dotreasury-admin";

const linkCollectionName = "link";
const userCollectionName = "user";
const commentCollectionName = "comment";
const reactionCollectionName = "reaction";
const attemptCollectionName = "attempt";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let linkCol = null;
let userCol = null;
let commentCol = null;
let reactionCol = null;
let attemptCol = null;

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

function withTransaction(fn, options) {
  return client.withSession((session) => {
    return session.withTransaction(fn, options);
  });
}

module.exports = {
  initDb,
  withTransaction,
  getLinkCollection,
  getUserCollection,
  getCommentCollection,
  getReactionCollection,
  getAttemptCollection,
};
