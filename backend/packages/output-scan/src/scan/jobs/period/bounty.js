const { getBountyCollection } = require("../../../mongo");

async function findBountiesInPeriod(startHeight, endHeight) {
  const col = await getBountyCollection();
  return await col.find(
    {
      $and: [
        { awardHeight: { $gt: startHeight } },
        { awardHeight: { $lte: endHeight } },
      ],
    },
    { projection: { _id: 0, bountyIndex: 1, indexer: 1, value: 1 } }
  ).sort({ bountyIndex: 1 }).toArray();
}

module.exports = {
  findBountiesInPeriod,
}
