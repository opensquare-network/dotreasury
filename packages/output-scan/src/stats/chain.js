const { getApi } = require("../api");
const { getBlockIndexer } = require("../block/getBlockIndexer");

async function getBlockIndexerByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const indexer = getBlockIndexer(block);
  return indexer;
}

module.exports = {
  getBlockIndexerByHeight,
};
