const {
  consts: {
    Modules,
    KsmTreasuryAccount,
    DotTreasuryAccount,
  },
  utils: { bigAdd },
  busLogger,
} = require("@osn/scan-common");
const { getIncomeTransferCollection } = require("../../../mongo/data");

async function handleBalancesWithdrawWithoutFee(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (Modules.Balances !== event.section || "Withdraw" !== event.method) {
    return
  }

  const maybeNextEvent = blockEvents[sort + 1];
  if (!maybeNextEvent) {
    return
  }
  const nextEvent = maybeNextEvent.event;
  if (Modules.Balances !== nextEvent.section || "Deposit" !== nextEvent.method) {
    return
  }
  if (![KsmTreasuryAccount, DotTreasuryAccount].includes(nextEvent.data[0].toString())) {
    return
  }

  const withdrawAccount = event.data[0].toString();
  const withdrawBalance = event.data[1].toString();
  const balance = nextEvent.data[1].toString();

  if (withdrawBalance !== balance) {
    return
  }

  const obj = {
    indexer,
    from: withdrawAccount,
    balance,
  };

  // todo: withdraw usually be related with business we haven't handle, for example XCM, so invest them and handle them.
  const col = await getIncomeTransferCollection()
  await col.insertOne(obj)

  busLogger.info(`Found balances withdraw to treasury at ${ indexer.blockHeight }`);

  return obj;
}

module.exports = {
  handleBalancesWithdrawWithoutFee,
}
