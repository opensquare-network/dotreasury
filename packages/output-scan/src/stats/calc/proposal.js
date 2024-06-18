const { getProposalCollection } = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function getProposalOutputStatsAt(indexer) {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol.find({ awardHeight: { $lte: indexer.blockHeight } }, {
    value: 1,
    awardHeight: 1
  }).toArray();

  return proposals.reduce((result, { value }) => bigAdd(result, value || 0), 0);
}

module.exports = {
  getProposalOutputStatsAt,
}
