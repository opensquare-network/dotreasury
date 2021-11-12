const { getOutTransferCollection } = require("../../mongo");
const {
  Modules,
  BalancesEvents,
  KsmTreasuryAccount,
  DotTreasuryAccount,
} = require("../common/constants");

async function handleTreasuryTransferOut(event, indexer) {
  const { section, method, } = event;
  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return;
  }

  const eventData = event.data.toJSON();
  const [from, to, balance] = eventData;
  if (![KsmTreasuryAccount, DotTreasuryAccount].includes(from)) {
    return;
  }

  const col = await getOutTransferCollection()
  await col.insertOne({
    indexer,
    dest: to,
    balance,
    eventData,
  })
}

module.exports = {
  handleTreasuryTransferOut,
}
