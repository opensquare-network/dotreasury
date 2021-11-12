const { MongoClient } = require("mongodb");

function DB(dbUrl, dbName) {
  const tipCollectionName = "tip";
  const bountyCollectionName = "bounty";
  const proposalCollectionName = "proposal";

  let client = null;
  let db = null;

  let tipCol = null;
  let bountyCol = null;
  let proposalCol = null;

  async function initDb() {
    client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
    });

    console.log('dbName', dbName);
    db = client.db(dbName);
    tipCol = db.collection(tipCollectionName);
    bountyCol = db.collection(bountyCollectionName);
    proposalCol = db.collection(proposalCollectionName);

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

  async function getTipCollection() {
    await tryInit(tipCol);
    return tipCol;
  }

  async function getBountyCollection() {
    await tryInit(bountyCol);
    return bountyCol;
  }

  async function getProposalCollection() {
    await tryInit(proposalCol);
    return proposalCol;
  }

  return {
    getTipCollection,
    getBountyCollection,
    getProposalCollection,
  };
}

module.exports = DB;
