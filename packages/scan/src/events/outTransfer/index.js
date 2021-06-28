const {
  Modules,
  BalancesEvents,
  TreasuryAccount,
  DotTreasuryAccount,
} = require("../../utils/constants");
const { getOutTransferCollection } = require("../../mongo");

async function saveOutputTransferRecord(data) {
  const col = await getOutTransferCollection();
  await col.insertOne(data);
}

async function handleTreasuryTransferOut(event, sort, normalizedExtrinsic) {
  const { section, method, data: args } = event;

  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return;
  }

  if (Modules.Sudo !== normalizedExtrinsic.section) {
    return;
  }

  const transferEventData = args.toJSON();
  const [source, , balance] = transferEventData;
  if (![TreasuryAccount, DotTreasuryAccount].includes(source)) {
    return;
  }

  await saveOutputTransferRecord({
    indexer: normalizedExtrinsic.extrinsicIndexer,
    eventSort: sort,
    balance,
    transferEventData,
  });
}

module.exports = {
  handleTreasuryTransferOut,
};
