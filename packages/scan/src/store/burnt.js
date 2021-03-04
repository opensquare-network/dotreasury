const { getBurntCollection } = require("../mongo");
const { getMetadataConstByBlockHash, getTreasuryBalance } = require("../utils");
const { asyncLocalStorage } = require("../utils");

async function getBurnPercent(blockHash) {
  const v = await getMetadataConstByBlockHash(blockHash, "Treasury", "Burn");
  return v ? v.toHuman() : v;
}

async function saveNewBurnt(balance, eventIndexer) {
  const treasuryBalance = await getTreasuryBalance(
    eventIndexer.blockHash,
    eventIndexer.blockHeight
  );
  const burnPercent = await getBurnPercent(eventIndexer.blockHash);

  const session = asyncLocalStorage.getStore();
  const burntCol = await getBurntCollection();
  await burntCol.insertOne(
    {
      indexer: eventIndexer,
      balance,
      treasuryBalance,
      burnPercent,
    },
    { session }
  );
}

module.exports = {
  saveNewBurnt,
};
