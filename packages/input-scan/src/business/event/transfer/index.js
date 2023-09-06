const { getIncomeTransferCollection } = require("../../../mongo/data");
const {
  consts: {
    Modules,
    BalancesEvents,
    KsmTreasuryAccount,
    DotTreasuryAccount,
  }
} = require("@osn/scan-common");

async function handleTransfer(event, indexer,) {
  const { section, method, } = event;
  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return;
  }

  const [from, dest,] = event.data.toJSON()
  if (![KsmTreasuryAccount, DotTreasuryAccount].includes(dest)) {
    return;
  }

  const obj = {
    indexer,
    from,
    balance: event.data[2].toString(),
  };

  const col = await getIncomeTransferCollection()
  await col.insertOne(obj)

  return obj;
}

module.exports = {
  handleTransfer,
}
