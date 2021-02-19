const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");
const { getMetadataConstByBlockHash } = require("../utils");

async function getTreasuryBalance(blockHash) {
  const api = await getApi();
  const account = (
    await api.query.system.account.at(blockHash, TreasuryAccount)
  ).toJSON();
  return account && account.data;
}

async function getBurnPercent(blockHash) {
  const v = await getMetadataConstByBlockHash(blockHash, "Treasury", "Burn");
  return v ? v.toHuman() : v;
}

async function saveNewBurnt(balance, eventIndexer) {
  const treasury = await getTreasuryBalance(eventIndexer.blockHash);
  const burnPercent = await getBurnPercent(eventIndexer.blockHash);

  const burntCol = await getBurntCollection();
  await burntCol.insertOne({
    indexer: eventIndexer,
    balance,
    treasury,
    burnPercent,
  });
}

module.exports = {
  saveNewBurnt,
};
