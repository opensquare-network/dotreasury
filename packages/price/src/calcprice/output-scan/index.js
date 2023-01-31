const { MongoClient } = require("mongodb");

function DB(dbUrl, dbName) {
  const tipCollectionName = "tip";
  const bountyCollectionName = "bounty";
  const proposalCollectionName = "proposal";
  const childBountyCollectionName = "childBounty";
  const referendaReferendumCollectionName = "referendaReferendum";

  let client = null;
  let db = null;

  let tipCol = null;
  let bountyCol = null;
  let proposalCol = null;
  let referendaReferendumCol = null;

  async function initDb() {
    client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
    });

    console.log('dbName', dbName);
    db = client.db(dbName);
    tipCol = db.collection(tipCollectionName);
    bountyCol = db.collection(bountyCollectionName);
    childBountyCol = db.collection(childBountyCollectionName);
    proposalCol = db.collection(proposalCollectionName);
    referendaReferendumCol = db.collection(referendaReferendumCollectionName);

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

  async function getChildBountyCollection() {
    await tryInit(childBountyCol);
    return childBountyCol;
  }

  async function getProposalCollection() {
    await tryInit(proposalCol);
    return proposalCol;
  }

  async function getReferendaReferendumCollection() {
    await tryInit(referendaReferendumCol);
    return referendaReferendumCol;
  };

  return {
    getTipCollection,
    getBountyCollection,
    getChildBountyCollection,
    getProposalCollection,
    getReferendaReferendumCollection,
  };
}

module.exports = DB;
