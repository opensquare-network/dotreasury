const { getBurnPercent } = require("../common/burnt/burnPercent");
const { getBurntCollection } = require("../../mongo");
const { getTreasuryBalance } = require("../common/balance/freeBalance");
const { TreasuryCommonEvent, Modules } = require("../common/constants");

async function handleBurntEvent(event, indexer) {
  const { section, method, } = event;
  if (section !== Modules.Treasury || TreasuryCommonEvent.Burnt !== method) {
    return;
  }

  const balance = event.data[0].toString();
  const treasuryBalance = await getTreasuryBalance(indexer.blockHash);
  const burnPercent = await getBurnPercent(indexer.blockHash);

  const col = await getBurntCollection();
  await col.insertOne({
    indexer,
    balance,
    treasuryBalance,
    burnPercent,
  });
}

module.exports = {
  handleBurntEvent,
}
