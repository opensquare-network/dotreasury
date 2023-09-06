const { toDecimal128 } = require("../../utils");
const { getOutTransferCollection } = require("../../mongo");
const {
  consts: {
    Modules,
    BalancesEvents,
    KsmTreasuryAccount,
    DotTreasuryAccount,
  }
} = require("@osn/scan-common");

async function handleTreasuryTransferOut(event, indexer, extrinsic) {
  const { section, method, } = event;
  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return;
  }

  if (Modules.Sudo !== extrinsic?.method?.section) {
    return
  }

  const eventData = event.data.toJSON();
  const [from, to, balance] = eventData;
  if (![KsmTreasuryAccount, DotTreasuryAccount].includes(from)) {
    return;
  }

  const col = await getOutTransferCollection()
  await col.insertOne({
    indexer,
    awardHeight: indexer.blockHeight,
    dest: to,
    balance,
    value: balance,
    dValue: toDecimal128(balance),
    eventData,
  })
}

module.exports = {
  handleTreasuryTransferOut,
}
