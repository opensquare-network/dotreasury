const { MongoClient } = require("mongodb");
const config = require("../../config");

const dbName = config.mongo.adminDbName || "dotreasury-admin";

const linkCollectionName = "link";
const userCollectionName = "user";
const addressCollectionName = "address";
const commentCollectionName = "comment";
const loginAttemptCollectionName = "loginAttempt";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let linkCol = null;
let userCol = null;
let addressCol = null;
let commentCol = null;
let loginAttemptCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  linkCol = db.collection(linkCollectionName);
  userCol = db.collection(userCollectionName);
  addressCol = db.collection(addressCollectionName);
  commentCol = db.collection(commentCollectionName);
  loginAttemptCol = db.collection(loginAttemptCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  userCol.createIndex({ username: 1 }, { unique: true });
  userCol.createIndex({ email: 1 }, { unique: true });

  addressCol.createIndex({ userId: 1, address: 1 }, { unique: true });
  addressCol.createIndex(
    { address: 1 },
    {
      unique: true,
      partialFilterExpression: {
        verified: { $eq: true },
      },
    }
  );

  loginAttemptCol.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

  commentCol.createIndex({ indexer: 1, createdAt: 1 });
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

async function getAddressCollection() {
  await tryInit(addressCol);
  return addressCol;
}

async function getCommentCollection() {
  await tryInit(commentCol);
  return commentCol;
}

async function getLoginAttemptCollection() {
  await tryInit(loginAttemptCol);
  return loginAttemptCol;
}

module.exports = {
  initDb,
  getLinkCollection,
  getUserCollection,
  getAddressCollection,
  getCommentCollection,
  getLoginAttemptCollection,
};
