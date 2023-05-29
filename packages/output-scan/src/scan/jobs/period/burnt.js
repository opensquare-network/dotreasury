const { getBurntCollection } = require("../../../mongo");

async function findBurntInPeriod(startHeight, endHeight) {
  const col = await getBurntCollection();
  return await col.find(
    {
      $and: [
        { "indexer.blockHeight": { $gt: startHeight } },
        { "indexer.blockHeight": { $lte: endHeight } },
      ],
    },
    { projection: { _id: 0, indexer: 1, value: 1 } }
  ).sort({ bountyIndex: 1 }).toArray();
}

module.exports = {
  findBurntInPeriod,
}
