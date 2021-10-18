const { findBlockApi } = require("../chain/spec");
const { getTreasuryBalanceV2 } = require("../utils/freeBalance");
const { getBurntCollection } = require("../mongo");

async function getBurnPercent(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  return blockApi.consts.treasury?.burn.toHuman()
}

async function saveNewBurnt(balance, eventIndexer) {
  const treasuryBalance = await getTreasuryBalanceV2(eventIndexer.blockHash);
  const burnPercent = await getBurnPercent(eventIndexer.blockHash);

  const burntCol = await getBurntCollection();
  await burntCol.insertOne({
    indexer: eventIndexer,
    balance,
    treasuryBalance,
    burnPercent,
  });
}

module.exports = {
  saveNewBurnt,
};
