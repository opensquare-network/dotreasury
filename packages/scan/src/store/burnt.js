const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");
const { getMetadataConstByBlockHash } = require("../utils");
const { expandMetadata } = require("@polkadot/metadata");

const ksmMigrateAccountHeight = 1492896;
let oldKey;

async function queryAccountFreeWithSystem(blockHash) {
  const api = await getApi();
  const account = (
    await api.query.system.account.at(blockHash, TreasuryAccount)
  ).toJSON();
  return account?.data?.free;
}

async function setOldKey() {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(1375085);
  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);

  oldKey = [decorated.query.balances.freeBalance, TreasuryAccount];
}

async function getTreasuryBalance(blockHash, blockHeight) {
  const api = await getApi();
  if (blockHeight < 1375086) {
    const metadata = await api.rpc.state.getMetadata(blockHash);
    const decorated = expandMetadata(metadata.registry, metadata);
    const key = [decorated.query.balances.freeBalance, TreasuryAccount];
    const value = await api.rpc.state.getStorage(key, blockHash);

    if (blockHeight === 1375085) {
      oldKey = key;
    }

    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < 1377831) {
    if (!oldKey) {
      await setOldKey();
    }
    const value = await api.rpc.state.getStorage(oldKey, blockHash);

    const metadata = await api.rpc.state.getMetadata(blockHash);
    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < ksmMigrateAccountHeight) {
    // TODO: find how to get the balance from 1377831 to 1492896
    return await queryAccountFreeWithSystem(blockHash);
  } else {
    return await queryAccountFreeWithSystem(blockHash);
  }
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
  getTreasuryBalance,
};
