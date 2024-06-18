const { getBurntCollection } = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function getBurnOutputStatsAt(indexer) {
  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({ "indexer.blockHeight": { $lte: indexer.blockHeight } }, {
    balance: 1,
    value: 1,
    indexer: 1
  }).toArray();

  return burntList.reduce((result, { value }) => bigAdd(result, value || 0), 0);
}

module.exports = {
  getBurnOutputStatsAt,
}
