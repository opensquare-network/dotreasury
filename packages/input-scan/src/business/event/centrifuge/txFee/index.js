const { getCfgTxFeeCol } = require("../../../../mongo/data");

function isTxFeeDeposit(blockEvents, depositEventIndex) {
  const nextEvent = blockEvents[depositEventIndex + 1];
  const nextNextEvent = blockEvents[depositEventIndex + 2];

  if ("balances" !== nextEvent.event.section || "Deposit" !== nextEvent.event.method) {
    return false;
  }

  return "transactionPayment" === nextNextEvent.event.section && "TransactionFeePaid" === nextNextEvent.event.method;
}

async function handleCentrifugeTxFee(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 2) {
    return;
  }

  if (!isTxFeeDeposit(blockEvents, sort)) {
    return;
  }

  const balance = event.data[0].toString();
  const nextNextEvent = blockEvents[sort + 2];
  const totalTxFee = nextNextEvent.event.data[1].toString();

  const obj = {
    indexer,
    section: "transactionPayment",
    method: "TransactionFeePaid",
    balance,
    totalTxFee,
  }

  const col = await getCfgTxFeeCol();
  await col.insertOne(obj);

  return obj;
}

module.exports = {
  handleCentrifugeTxFee,
}
