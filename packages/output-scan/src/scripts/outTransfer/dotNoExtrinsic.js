require("dotenv").config();

const {
  chain: { getApi, getBlockIndexer }
} = require("@osn/scan-common");
const { handleTransferOutWithoutExtrinsic } = require("../../business/event/transfer/outWithoutExtrinsic");

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

async function handleEvents(events, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];
    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    }

    if (!phase.isNone) {
      continue;
    }

    await handleTransferOutWithoutExtrinsic(event, indexer);
  }
}

(async () => {
  const api = await getApi();
  for (const height of blocks) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    const blockIndexer = getBlockIndexer(block.block);
    await handleEvents(allEvents, blockIndexer);
  }

  process.exit(0);
})();
