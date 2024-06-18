const {
  getBountyCollection,
} = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function getBountyOutputStatsAt(indexer) {
  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({ awardHeight: { $lte: indexer.blockHeight } }, {
    value: 1,
    awardHeight: 1
  }).toArray();

  return bounties.reduce((result, { value }) => bigAdd(result, value || 0), 0);
}

module.exports = {
  getBountyOutputStatsAt,
}
