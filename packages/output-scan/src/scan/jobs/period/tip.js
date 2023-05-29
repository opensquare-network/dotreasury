const { getTipCollection } = require("../../../mongo");

async function findTipsInPeriod(startHeight, endHeight) {
  const col = await getTipCollection();
  return await col.find(
    {
      $and: [
        { awardHeight: { $gt: startHeight } },
        { awardHeight: { $lte: endHeight } },
      ],
    },
    { projection: { _id: 0, hash: 1, indexer: 1, value: 1 } }
  ).sort({ "indexer.blockHeight": 1 }).toArray();
}

module.exports = {
  findTipsInPeriod,
}
