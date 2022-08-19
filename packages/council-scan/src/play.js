require("dotenv").config();

const {
  chain: {
    setSpecHeights,
    getApi,
  },
} = require("@osn/scan-common");
const { handleBlock } = require("./scan/block");

async function test() {
  const blockHeights = [
    // 13320000,
    12470400,
    12480986,
  ];

  const api = await getApi();
  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await handleBlock({
      block: block.block,
      events: allEvents,
      height,
    });
  }

  process.exit(0);
}

test();
