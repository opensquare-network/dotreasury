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

  const api = await getApi();

  const blocks = [];
  for (const blockInDb of blocksInDb) {
    let blockHash = blockInDb.blockHash;
    if (!blockHash) {
      blockHash = await api.rpc.chain.getBlockHash(blockInDb.height);
    }

    const registry = await findRegistry({
      blockHeight: blockInDb.height,
      blockHash,
    });
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

  return await Promise.all(allPromises)
}

async function fetchOneBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  return {
    height,
    block: block.block,
    events: allEvents,
  }
}

module.exports = {
  fetchBlocks,
}
