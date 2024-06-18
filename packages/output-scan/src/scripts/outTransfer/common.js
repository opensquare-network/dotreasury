const { handleTransferOutWithoutExtrinsic } = require("../../business/event/transfer/outWithoutExtrinsic");
const {
  chain: { getApi, getBlockIndexer }
} = require("@osn/scan-common");

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

async function getIndexerAndEvents(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);

  return {
    indexer: blockIndexer,
    events: allEvents,
  }
}

module.exports = {
  handleEvents,
  getIndexerAndEvents,
}
