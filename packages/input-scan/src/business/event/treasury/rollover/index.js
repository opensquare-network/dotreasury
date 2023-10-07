const { getLastPeriod, insertPeriod } = require("../../../../mongo/service/period");
const { getGenesisBlockIndexer } = require("./genesisBlock");
const { getNextBlockIndexer } = require("./nextBlockIndexer");
const { setPeriodMark } = require("../../../../store/period");

async function handleRollover(event, indexer) {
  const endIndexer = indexer;
  const remaining = event.data[0].toString();
  let lastPeriod = await getLastPeriod(indexer.blockHeight);
  let startIndexer;
  if (!lastPeriod) {
    startIndexer = await getGenesisBlockIndexer();
  } else {
    startIndexer = await getNextBlockIndexer(lastPeriod.endIndexer.blockHeight);
  }

  await insertPeriod({
    endHeight: endIndexer.blockHeight,
    startIndexer,
    endIndexer,
    remaining,
  });

  setPeriodMark(indexer.blockHeight);
}

module.exports = {
  handleRollover,
}
