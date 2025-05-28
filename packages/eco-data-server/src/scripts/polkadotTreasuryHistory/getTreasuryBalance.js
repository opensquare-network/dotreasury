const { multiApiQuery } = require("../../apis/treasury/polkadot/common");
const {
  getTreasuryOnHydrationFromApi,
} = require("../../apis/treasury/polkadot/treasuryOnHydration");
const {
  getTreasuryDotOnRelayChainFromApi,
  getBountyTreasuryOnRelayChainFromApi,
} = require("../../apis/treasury/polkadot/treasuryOnRelay");
const {
  getFellowshipTreasuryDotOnAssetHubFromApi,
} = require("../../apis/treasury/polkadot/fellowshipTreasuryOnAssetHub");
const {
  getFellowshipSalaryUsdtOnAssetHubFromApi,
} = require("../../apis/treasury/polkadot/fellowshipSalaryOnAssetHub");
const {
  getAmbassadorTreasuryOnAssetHubFromApi,
} = require("../../apis/treasury/polkadot/ambassadorTreasuryOnAssetHub");
const {
  getTreasuryOnAssetHubFromApi,
} = require("../../apis/treasury/polkadot/treasuryOnAssetHub");
const {
  getMythTreasuryOnMythosFromApi,
} = require("../../apis/treasury/polkadot/treasuryOnMythos");
const {
  getLoansBifrostDotBalanceByBlockHeight,
} = require("../../apis/treasury/polkadot/loans");

const oneDay = 24 * 60 * 60 * 1000;

const BlockIntervals = {
  polkadot: 6,
  polkadotAssetHub: 12,
  hydradx: 12,
  bifrostPolkadot: 6,
};

async function getBlockHash(api, blockInterval, daysAgo) {
  const blockHash = await api.rpc.chain.getFinalizedHead();
  if (daysAgo === 0) {
    return blockHash;
  }

  const blocksAgo = (daysAgo * oneDay) / (blockInterval * 1000);
  const blockNumber = await api.query.system.number.at(blockHash);
  const targetBlockNumber = blockNumber.toNumber() - blocksAgo;
  return await api.rpc.chain.getBlockHash(targetBlockNumber);
}

async function getPolkadotTreasuries(api, daysAgo) {
  const blockHash = await getBlockHash(api, BlockIntervals.polkadot, daysAgo);
  const blockApi = await api.at(blockHash);

  const treasuryDotOnRelay = await getTreasuryDotOnRelayChainFromApi(blockApi);
  const bountyTreasuryOnRelay = await getBountyTreasuryOnRelayChainFromApi(
    blockApi,
  );

  return {
    treasuryDotOnRelay,
    bountyTreasuryOnRelay,
  };
}

async function getPolkadotAssetHubTreasuries(api, daysAgo) {
  const blockHash = await getBlockHash(
    api,
    BlockIntervals.polkadotAssetHub,
    daysAgo,
  );
  const blockApi = await api.at(blockHash);

  const fellowshipTreasuryDotOnAssetHub =
    await getFellowshipTreasuryDotOnAssetHubFromApi(blockApi);

  const fellowshipSalaryUsdtBalance =
    await getFellowshipSalaryUsdtOnAssetHubFromApi(blockApi);

  const ambassadorTreasuryUsdtBalance =
    await getAmbassadorTreasuryOnAssetHubFromApi(blockApi);

  const {
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
  } = await getTreasuryOnAssetHubFromApi(blockApi);

  const mythTreasuryBalance = await getMythTreasuryOnMythosFromApi(blockApi);

  return {
    fellowshipTreasuryDotOnAssetHub,
    fellowshipSalaryUsdtBalance,
    ambassadorTreasuryUsdtBalance,
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
    mythTreasuryBalance,
  };
}

async function getHydrationTreasuries(api, daysAgo) {
  const blockHash = await getBlockHash(api, BlockIntervals.hydradx, daysAgo);
  const blockApi = await api.at(blockHash);

  return await getTreasuryOnHydrationFromApi(blockApi);
}

async function getLoansBifrostDotBalance(api, daysAgo) {
  const blockHash = await api.rpc.chain.getFinalizedHead();
  if (daysAgo === 0) {
    return blockHash;
  }

  const blocksAgo =
    (daysAgo * oneDay) / (BlockIntervals.bifrostPolkadot * 1000);
  const blockNumber = await api.query.system.number.at(blockHash);
  const targetBlockNumber = blockNumber.toNumber() - blocksAgo;

  const loansBifrostDotBalance = await getLoansBifrostDotBalanceByBlockHeight(
    targetBlockNumber,
  );
  return {
    loansBifrostDotBalance,
  };
}

async function getTreasuryBalance(daysAgo) {
  const polkadotTreasuries = await multiApiQuery("polkadot", (api) =>
    getPolkadotTreasuries(api, daysAgo),
  );

  const polkadotAssetHubTreasuries = await multiApiQuery(
    "polkadotAssetHub",
    (api) => getPolkadotAssetHubTreasuries(api, daysAgo),
  );

  const hydrationTreasuries = await multiApiQuery("hydradx", (api) =>
    getHydrationTreasuries(api, daysAgo),
  );

  const bifrostTreasuries = await multiApiQuery("bifrostPolkadot", (api) =>
    getLoansBifrostDotBalance(api, daysAgo),
  );

  return {
    ...polkadotTreasuries,
    ...polkadotAssetHubTreasuries,
    ...hydrationTreasuries,
    ...bifrostTreasuries,
  };
}

module.exports = {
  getTreasuryBalance,
};
