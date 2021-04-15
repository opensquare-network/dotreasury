const {
  Modules,
  BalancesEvents,
  TreasuryAccount,
  DotTreasuryAccount,
} = require("../utils/constants");
const { getIncomeTransferCollection } = require("../mongo");

async function saveIncomeTransferRecord(data) {
  const col = await getIncomeTransferCollection();
  await col.insertOne(data);
}

async function handleTransferToTreasuryAccount(event, sort, blockIndexer) {
  const {
    event: { section, method, data: args },
  } = event;
  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return false;
  }

  const transferEventData = args.toJSON();
  const [, dest, balance] = transferEventData;
  if (![TreasuryAccount, DotTreasuryAccount].includes(dest)) {
    return false;
  }

  const data = {
    indexer: blockIndexer,
    eventSort: sort,
    balance,
    transferEventData,
  };

  await saveIncomeTransferRecord(data);
  return data;
}

module.exports = {
  handleTransferToTreasuryAccount,
};
