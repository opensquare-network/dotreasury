const { getPeriodCol } = require("../index");

async function getLastPeriod(height) {
  const col = await getPeriodCol();
  const periods = await col.find({ endHeight: { $lt: height } }).sort({ endHeight: -1 }).limit(1).toArray();
  return periods.length > 0 ? periods[0] : null;
}

async function insertPeriod(obj = {}, indexer) {
  if (!obj.startIndexer || !obj.endIndexer) {
    throw new Error(`No start or end indexer when insert period at ${ indexer.blockHeight }`)
  }

  const col = await getPeriodCol();
  await col.insertOne(obj);
}

async function getPeriodByEndHeight(endHeight) {
  const col = await getPeriodCol();
  return col.findOne({ endHeight });
}

async function updatePeriod(endHeight, updates = {}) {
  const col = await getPeriodCol();
  await col.updateOne(
    { endHeight },
    { $set: updates },
  );
}

module.exports = {
  getLastPeriod,
  insertPeriod,
  getPeriodByEndHeight,
  updatePeriod,
}
