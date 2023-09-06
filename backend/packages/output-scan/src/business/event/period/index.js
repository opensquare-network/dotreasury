const { setPeriodMark } = require("../../../store");
const { getNextBlockIndexer } = require("./nextBlockIndexer");
const { getGenesisBlockIndexer } = require("./genesisBlock");
const { getLastPeriod, insertPeriod } = require("../../../mongo/service");
const {
  consts: { Modules }
} = require("@osn/scan-common");

async function handleRollover(event, indexer) {
  const { section, method, } = event;
  if (section !== Modules.Treasury || "Rollover" !== method) {
    return;
  }

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
