const { multiApiQuery } = require("../apis/treasury/polkadot/common");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { createChainApis } = require("../apis");
dayjs.extend(utc);

const oneDay = 24 * 60 * 60 * 1000;

const BlockIntervals = {
  polkadot: 6,
};

async function getBlockHash(api, blockInterval, daysAgo) {
  const blockHash = await api.rpc.chain.getFinalizedHead();
  if (daysAgo === 0) {
    return blockHash;
  }

  const blocksAgo = (daysAgo * oneDay) / (blockInterval * 1000);
  console.log("blocksAgo", blocksAgo);
  const blockNumber = await api.query.system.number.at(blockHash);
  console.log("blockNumber", blockNumber.toNumber());
  const targetBlockNumber = blockNumber.toNumber() - blocksAgo;
  console.log("targetBlockNumber", targetBlockNumber);
  const targetBlockHash = await api.rpc.chain.getBlockHash(targetBlockNumber);
  return targetBlockHash;
}

async function getBlockInfo(chain, daysAgo) {
  const blockHash = await multiApiQuery(chain, (api) =>
    getBlockHash(api, BlockIntervals[chain], daysAgo),
  );
  console.log("blockHash", blockHash.toJSON());
}

async function getTreasuryBalance(chain, daysAgo) {
  const blockHeight = await getBlockInfo(chain, daysAgo);
  console.log({ blockHeight });
}

async function generateTreasuryItemAtDaysAgo(daysAgo) {
  const balance = await getTreasuryBalance("polkadot", daysAgo);
  console.log("balance", balance);
}

async function generateTreasuryHistory() {
  for (let i = 0; i < 30; i++) {
    await generateTreasuryItemAtDaysAgo(i);
  }
}

createChainApis().then(async () => {
  console.log("createChainApis");
  await generateTreasuryHistory();
});
