const {
  Modules, BalancesEvents, TreasuryAccount,
  DotTreasuryAccount,
} = require("../../utils/constants")
const { getOutTransferCollection } = require("../../mongo")

async function saveOutputTransferRecord(data) {
  const col = await getOutTransferCollection();
  await col.insertOne(data);
}

async function handleTreasuryTransferOut(event, sort, blockIndexer) {
  const { section, method, data: args ,} = event;

  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return false;
  }

  const transferEventData = args.toJSON();
  const [source, , balance] = transferEventData;
  if (![TreasuryAccount, DotTreasuryAccount].includes(source)) {
    return false;
  }

  await saveOutputTransferRecord({
    indexer: blockIndexer,
    eventSort: sort,
    balance,
    transferEventData,
  })

  return true
}

module.exports = {
  handleTreasuryTransferOut
}