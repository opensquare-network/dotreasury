require("dotenv").config();
const { scanNormalizedBlock } = require("./scan/block");
const { setSpecHeights } = require("./chain/specs");
const { getApi } = require("./api")

async function test() {
  const blockHeights = [
    5952693,
    6006978
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(block.block, allEvents);
  }
}

test();
