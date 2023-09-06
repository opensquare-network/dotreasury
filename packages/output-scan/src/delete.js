const { getBurntCollection } = require("./mongo");

async function deleteFrom(height = 0) {
  const col = await getBurntCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

module.exports = {
  deleteFrom,
}
