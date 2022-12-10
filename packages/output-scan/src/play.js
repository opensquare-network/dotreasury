require("dotenv").config();
const { scanNormalizedBlock } = require("./scan/block");
const {
  chain: { getApi, setSpecHeights }
} = require("@osn/scan-common");

async function test() {
  const blockHeights = [
    14640731,
    14646188,
    14646190,
    14689808,
    14850112,
    14850289,
    14850291,
    14893360,
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(block.block, allEvents);
  }

  console.log('finished')
  process.exit(0);
}

test();
