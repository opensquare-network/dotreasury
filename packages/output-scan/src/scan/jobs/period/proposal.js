const { getProposalCollection } = require("../../../mongo");

async function findProposalsInPeriod(startHeight, endHeight) {
  const col = await getProposalCollection();
  return await col.find(
    {
      $and: [
        { awardHeight: { $gt: startHeight } },
        { awardHeight: { $lte: endHeight } },
      ],
    },
    { projection: { _id: 0, proposalIndex: 1, indexer: 1, value: 1 } }
  ).sort({ proposalIndex: 1 }).toArray();
}

module.exports = {
  findProposalsInPeriod,
}
