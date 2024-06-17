// check out transfer from treasury without an extrinsic

const { treasuryPubKey } = require("./consts");
const { getOutTransferCollection } = require("../../../mongo");
const { toDecimal128 } = require("../../../utils");

async function handleTransferOutWithoutExtrinsic(event, indexer) {
  const fromPubKey = event.data[0].toHex();
  if (treasuryPubKey !== fromPubKey) {
    return;
  }

  const to = event.data[1].toString();
  const balance = event.data[2].toJSON();
  const eventData = event.data.toJSON();

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
  handleTransferOutWithoutExtrinsic,
}
