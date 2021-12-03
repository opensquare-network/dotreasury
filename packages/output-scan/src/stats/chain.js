const { getApi, getBlockIndexer } = require("@dotreasury/common");

async function getBlockIndexerByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const indexer = getBlockIndexer(block.block);
  return indexer;
}

module.exports = {
  getBlockIndexerByHeight,
};
