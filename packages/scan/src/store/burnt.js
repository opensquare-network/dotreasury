const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");

async function getTreasuryBalance(blockHash) {
  const api = await getApi();
  const account = (await api.query.system.account.at(blockHash, TreasuryAccount)).toJSON();
  return account && account.data;
}

async function saveNewBurnt(balance, blockIndexer) {
  const treasury = await getTreasuryBalance(blockIndexer.blockHash);

  const burntCol = await getBurntCollection();
  await burntCol.insertOne({
    indexer: blockIndexer,
    balance,
    treasury,
  });
}

module.exports = {
  saveNewBurnt,
}
