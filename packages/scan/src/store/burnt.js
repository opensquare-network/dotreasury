const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");

async function getTreasuryBalance(blockHash) {
  const api = await getApi();
  const account = (await api.query.system.account.at(blockHash, TreasuryAccount)).toJSON();
  return account && account.data;
}

async function getBurnPrecent() {
  const api = await getApi();
  return api.consts.treasury.burn.toHuman();
}

async function saveNewBurnt(balance, eventIndexer) {
  const treasury = await getTreasuryBalance(eventIndexer.blockHash);
  const burnPrecent = await getBurnPrecent();

  const burntCol = await getBurntCollection();
  await burntCol.insertOne({
    indexer: eventIndexer,
    balance,
    treasury,
    burnPrecent,
  });
}

module.exports = {
  saveNewBurnt,
}
