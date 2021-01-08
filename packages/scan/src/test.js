const blocks = require("./blocks.txt.js");
const { handleBlock } = require("./block");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { getApi } = require("./api");
const { getBlockIndexer } = require("./block/getBlockIndexer");

const START = 25935
const TIP_START = 602672
const BOUNTY_START = 4501546
const PROPOSAL_START = 126165

async function test() {
  const api = await getApi();

  for (let scanHeight of blocks) {
    // if (scanHeight < 3297797) {
    //   continue;
    // }
    // if (scanHeight > 3187473) {
    //   break;
    // }
    const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);
    await handleBlockAndEvents(block, allEvents);
  }
}

async function handleBlockAndEvents(block, allEvents) {
  const blockIndexer = getBlockIndexer(block.block);

  await handleBlock(block, allEvents);
  console.log(`block ${block.block.header.number.toNumber()} is saved to db`);

  await handleEvents(allEvents, blockIndexer, block.block.extrinsics);
  await handleExtrinsics(block.block.extrinsics, allEvents, blockIndexer);
}

test().catch(console.error);
