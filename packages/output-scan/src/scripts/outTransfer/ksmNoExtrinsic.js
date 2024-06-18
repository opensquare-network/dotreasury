require("dotenv").config();
const { getIndexerAndEvents, handleEvents } = require("./common");

const blocks = [
  5457600,
  10890388,
  10920288,
  10990684,
  11273421,
  12816000,
  13118400,
  13320000,
  14025600,
  14126400,
  15547366,
  17198169,
  18770106,
];

(async () => {
  for (const height of blocks) {
    const { indexer, events } = await getIndexerAndEvents(height);
    await handleEvents(events, indexer);
  }

  process.exit(0);
})();
