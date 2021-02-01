const { getBurntCollection } = require("../mongo");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");

async function getTreasuryBalance(blockHash) {
  const api = await getApi();
  const account = (
    await api.query.system.account.at(blockHash, TreasuryAccount)
  ).toJSON();
  return account && account.data;
}

async function getBurnPercent(blockHash) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);

  let iterVersion = 0;
  const metadata = registry.metadata.get("metadata");
  while (iterVersion < 1000) {
    if (!metadata[`isV${iterVersion}`]) {
      iterVersion++;
      continue;
    }

    const modules = metadata[`asV${iterVersion}`].get("modules");
    const treasuryModule = modules.find(
      (module) => module.name.toString() === "Treasury"
    );
    if (!treasuryModule) {
      // TODO: should throw error
      break;
    }

    const burnConstant = treasuryModule.constants.find(
      (constant) => constant.name.toString() === "Burn"
    );
    const typeName = burnConstant.type.toString();
    const Type = registry.registry.get(typeName);
    return new Type(registry.registry, burnConstant.value).toHuman();
  }

  return null;
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
