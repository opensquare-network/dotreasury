require("dotenv").config();
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger, isHex } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { processStat } = require("./stats");
const { handleIncomeEvents } = require("./income");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { hexToU8a } = require("@polkadot/util");

let registry;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    let targetHeight = chainHeight;
    if (scanHeight + 100 < chainHeight) {
      targetHeight = scanHeight + 100;
    }

    const blocks = await getBlocks(scanHeight, targetHeight);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: do following operations in one transaction
      try {
        await scanBlock(block);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(3000);
        logger.error(`Error with block scan ${scanHeight}`, e);
      }
    }

    scanHeight = targetHeight + 1;
    logger.info(`block ${targetHeight} done`);
  }
}

async function scanBlock(blockInDb) {
  if (!registry || registry.specVersion.toNumber() !== blockInDb.specVersion) {
    registry = await getRegistryByHeight(blockInDb.height);
  }

  let block;
  if (isHex(blockInDb.block)) {
    block = new GenericBlock(registry.registry, hexToU8a(blockInDb.block));
  } else {
    block = new GenericBlock(registry.registry, blockInDb.block.block);
  }
  const allEvents = registry.registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  await scanNormalizedBlock(block, allEvents);
}

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleIncomeEvents(blockEvents, blockIndexer, block.extrinsics);
  await processStat(blockIndexer);
}

async function getRegistryByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return await api.getBlockRegistry(blockHash);
}

async function test() {
  const height = 3543099;
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  await scanNormalizedBlock(block.block, allEvents);
}

async function testBlockInDb() {
  const blockInDb = {
    height: 1142221,
    version: 1,
    block: {
      block: {
        extrinsics: [
          "0x280403000bb054e5eb7301",
          "0x1004140000",
          "0x3d0284622470e00c50400929243e6e9ed4c62edc88c1a4f7f70e62bca37c277ef3ae740122e073e669fb28f15b1766f04319e4bd63f7c04ac5ee1f310b0f3ec9c746d069c6c65858f4ee182beee4251662095384fb027fdfb45e96532b2c004e29f6c9887500400013000b00407a10f35ade0cd5c4016de9aeba888fb186a2a8bbd0979b2fdce88578858e6f2adb7f8f4e",
        ],
        header: {
          digest: {
            logs: [
              "0x0642414245b5010325000000cd5fde0f00000000446ed38e49b92bf57706cea1908374e91cc15c974c9037cc9c9d0df413804e512b71c231c3b5b4f6e1206d0184958d9eb891f5e0234553be87186276032502065f258b4d3c90134f27dd4b25432fe5b2870d8d893927c68a920e26bd5e598906",
              "0x05424142450101b67cd5ed87ccb54fc7994c1ea5fc2f21532f039affaf96054e4ddc86a8c616155d2f6c26ec64baa4ea3917ca2fc5c505d007f4eba1d108887073ab34059f6483",
            ],
          },
          extrinsicsRoot:
            "0xdf592e2ba52fbfdaa72131d3b8a2917a769246eb9f8fb1934bba67041c11bda6",
          number: "0x116dcd",
          parentHash:
            "0x69e30ea48fb9ad3cf75f413b73b985e4bfa520c83d5f95ed887a84e7b15c8182",
          stateRoot:
            "0xc111a2e66368122b2741a0d1dd71d4a849541754c9245f632f3f7a2fab5cd926",
        },
      },
      justifications: null,
    },
    events:
      "0x1c0000000000000080e36a09000000000200000001000000000000ca9a3b0000000002000000020000000305622470e00c50400929243e6e9ed4c62edc88c1a4f7f70e62bca37c277ef3ae74005039278c04000000000000000000000000020000000e00000000000000020000000e060017640700000000000000000000000000000200000003041650c532ed1a8641e8922aa24ade0ff411d03edd9ed1c6b7fe42f1a801cee37cc005d90100000000000000000000000000000200000000004048901400000000000000",
    specVersion: 17,
    author: null,
  };

  await scanBlock(blockInDb);
}

// FIXME: log the error
main().catch(console.error);
// test()
// testBlockInDb()
