const { MongoClient } = require("mongodb");

function DB(dbUrl, dbName) {
  const tipCollectionName = "tip";
  const bountyCollectionName = "bounty";
  const proposalCollectionName = "proposal";
  const childBountyCollectionName = "childBounty";
  const referendaReferendumCollectionName = "referendaReferendum";
  const subsquareTreasurySpendCollectionName = "subsquareTreasurySpend";

  let client = null;
  let db = null;

  let tipCol = null;
  let bountyCol = null;
  let proposalCol = null;
  let referendaReferendumCol = null;
  let childBountyCol = null;
  let periodCol = null; // spend periods
  let subsquareTreasurySpendCol = null;

  async function initDb() {
    client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
    });

    console.log("dbName", dbName);
    db = client.db(dbName);
    tipCol = db.collection(tipCollectionName);
    bountyCol = db.collection(bountyCollectionName);
    childBountyCol = db.collection(childBountyCollectionName);
    proposalCol = db.collection(proposalCollectionName);
    referendaReferendumCol = db.collection(referendaReferendumCollectionName);
    periodCol = db.collection("period");
    subsquareTreasurySpendCol = db.collection(
      subsquareTreasurySpendCollectionName,
    );
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
  }

  async function getPeriodCol() {
    await tryInit(periodCol);
    return periodCol;
  }

  async function getSubsquareTreasurySpendCollection() {
    await tryInit(subsquareTreasurySpendCol);
    return subsquareTreasurySpendCol;
  }

  return {
    getTipCollection,
    getBountyCollection,
    getChildBountyCollection,
    getProposalCollection,
    getReferendaReferendumCollection,
    getPeriodCol,
    getSubsquareTreasurySpendCollection,
  };
}

module.exports = DB;
