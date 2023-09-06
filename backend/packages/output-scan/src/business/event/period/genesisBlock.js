const { chain: { getApi, getBlockIndexer } } = require("@osn/scan-common");

async function getGenesisBlockIndexer() {
  const blockHeight = 1;
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const block = await api.rpc.chain.getBlock(blockHash);

  return getBlockIndexer(block.block);
}

module.exports = {
  getGenesisBlockIndexer,
}
