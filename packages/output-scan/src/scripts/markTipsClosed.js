require("dotenv").config();
const {
  chain: { getApi, getBlockIndexer },
  consts: { CHAINS },
  env: { currentChain },
} = require("@osn/scan-common");
const { removePolkadotTips } = require("../scan/known-business/polkadot/removePolkadotTips");
const { removeKusamaTips } = require("../scan/known-business/kusama/removeKusamaTip");

const polkadotHeight = 18407475;
const kusamaHeight = 18062739;

async function queryBlockIndexer() {
  const api = await getApi();
  if (![CHAINS.POLKADOT, CHAINS.KUSAMA].includes(currentChain())) {
    throw new Error(`Invalid chain: ${ currentChain() }`);
  }

  const height = CHAINS.POLKADOT === currentChain() ? polkadotHeight : kusamaHeight;
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  return getBlockIndexer(block.block);
}

(async () => {
  const indexer = await queryBlockIndexer();
  await removePolkadotTips(indexer);
  await removeKusamaTips(indexer);

  process.exit(0);
})();
