const {
  getTipCollection,
} = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function getTipOutputStatsAt(indexer) {
  const tipCol = await getTipCollection();
  const tips = await tipCol.find({ awardHeight: { $lte: indexer.blockHeight } }, {
    value: 1,
    awardHeight: 1
  }).toArray();

  return tips.reduce((result, { value }) => bigAdd(result, value || 0), 0);
}

module.exports = {
  getTipOutputStatsAt,
}
