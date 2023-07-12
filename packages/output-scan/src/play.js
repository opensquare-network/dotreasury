require("dotenv").config();
const { handleBlock } = require("./scan/block");
const {
  chain: { getApi, setSpecHeights }
} = require("@osn/scan-common");

async function test() {
  const blockHeights = [
    18553231,
    18555631,
    18730652,
    18730653,
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await handleBlock({
      height,
      block: block.block,
      events: allEvents
    });
    console.log(`${height} done`)
  }

  console.log('finished')
  process.exit(0);
}

test();
