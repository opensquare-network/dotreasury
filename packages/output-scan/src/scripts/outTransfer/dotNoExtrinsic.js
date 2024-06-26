require("dotenv").config();
const { handleEvents, getIndexerAndEvents } = require("./common");

const blocks = [
  3628800,
  10557894,
  12477299,
  12749846,
  14592406,
  15559418,
  16263631,
  16548113,
  18454214,
  19729007,
  20094002,
];

(async () => {
  for (const height of blocks) {
    const { indexer, events } = await getIndexerAndEvents(height);
    await handleEvents(events, indexer);
  }

  process.exit(0);
})();
