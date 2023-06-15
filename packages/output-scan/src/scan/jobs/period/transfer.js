const { getOutTransferCollection } = require("../../../mongo");

async function findOutTransfersInPeriod(startHeight, endHeight) {
  const col = await getOutTransferCollection();
  return await col.find(
    {
      $and: [
        { awardHeight: { $gt: startHeight } },
        { awardHeight: { $lte: endHeight } },
      ],
    },
    { projection: { _id: 0, indexer: 1, value: 1 } }
  ).sort({ "indexer.blockHeight": 1 }).toArray();
}

module.exports = {
  findOutTransfersInPeriod,
}
