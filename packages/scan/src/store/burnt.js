const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");
const { getMetadataConstByBlockHash } = require("../utils");
const { expandMetadata } = require("@polkadot/metadata");

const ksmMigrateAccountHeight = 1492896;

async function getTreasuryBalance(blockHash, blockHeight) {
  const api = await getApi();

  if (blockHeight >= ksmMigrateAccountHeight) {
    const account = (
      await api.query.system.account.at(blockHash, TreasuryAccount)
    ).toJSON();
    return account?.data?.free;
  }

  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);
  const value = await api.rpc.state.getStorage(
    [decorated.query.balances.freeBalance, TreasuryAccount],
    blockHash
  );

  return metadata.registry.createType("Compact<Balance>", value).toJSON();
}

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
