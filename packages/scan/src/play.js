require("dotenv").config();

const { scanNormalizedBlock } = require("./scan/scanNormalized");
const { getApi } = require("./api");
const { setSpecHeights } = require("./mongo/service/specs");

async function test() {
  const height = 9779821;
  setSpecHeights([height]);
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  await scanNormalizedBlock(block.block, allEvents);
}

test()
