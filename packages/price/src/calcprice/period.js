const { getPrice } = require("./price");

async function saveOnePeriod(chain, col, period) {
  const { endIndexer: { blockTime }, endHeight } = period;
  if (!blockTime) {
    console.error(`Can not ${ chain } get blockTime of period, ${ endHeight }`);
  }

  const symbolPrice = await getPrice(chain, blockTime);
  if (!symbolPrice) {
    console.error(`Can not get ${ chain } price for period ${ endHeight }`);
  }
  await col.updateOne({ endHeight }, { $set: { symbolPrice } });
}

async function savePeriodPrice(chain, col) {
  const periods = await col.find({}, { projection: { _id: 0, endHeight: 1, endIndexer: 1 } }).toArray();
  for (const period of periods) {
    await saveOnePeriod(chain, col, period);
  }
}

module.exports = {
  savePeriodPrice,
}
