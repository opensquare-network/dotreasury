const { findRegistry } = require("../chain/specs");
const { getBlocksByHeights } = require("../mongo/meta");
const { isUseMetaDb } = require("../env");
const { getApi } = require("../api")
const { GenericBlock } = require("@polkadot/types");

async function fetchBlocks(heights = []) {
  if (isUseMetaDb()) {
    return await fetchBlocksFromDb(heights);
  } else {
    return await fetchBlocksFromNode(heights);
  }
}

async function fetchBlocksFromDb(heights = []) {
  const blocksInDb = await getBlocksByHeights(heights);

  const blocks = [];
  for (const blockInDb of blocksInDb) {
    const registry = await findRegistry(blockInDb.height);
    const block = new GenericBlock(registry, blockInDb.block.block);
    const allEvents = registry.createType(
      "Vec<EventRecord>",
      blockInDb.events,
      true
    );

    blocks.push({
      height: blockInDb.height,
      block,
      events: allEvents,
    })
  }

  return blocks;
}

async function fetchBlocksFromNode(heights = []) {
  const allPromises = []
  for (const height of heights) {
    allPromises.push(fetchOneBlockFromNode(height))
  }

  const blocks = await Promise.all(allPromises)
  return blocks
}

async function fetchOneBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  return {
    height,
    block,
    events: allEvents,
  }
}

module.exports = {
  fetchBlocks,
}
