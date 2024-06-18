const { getOutTransferCollection } = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function getTransferOutputStatsAt(indexer) {
  const outTransferCol = await getOutTransferCollection();
  const outTransfers = await outTransferCol.find({ "indexer.blockHeight": { $lte: indexer.blockHeight } }, {
    awardHeight: 1,
    balance: 1,
    value: 1
  }).toArray();

  return outTransfers.reduce((result, { value }) => bigAdd(result, value || 0), 0);
}

module.exports = {
  getTransferOutputStatsAt,
}
