require("dotenv").config();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { createChainApis } = require("../apis");
const { multiApiQuery } = require("../apis/treasury/polkadot/common");
const {
  getTreasuryOnHydrationFromApi,
} = require("../apis/treasury/polkadot/treasuryOnHydration");
const {
  getTreasuryDotOnRelayChainFromApi,
  getBountyTreasuryOnRelayChainFromApi,
} = require("../apis/treasury/polkadot/treasuryOnRelay");
const {
  getFellowshipTreasuryDotOnAssetHubFromApi,
} = require("../apis/treasury/polkadot/fellowshipTreasuryOnAssetHub");
const {
  getFellowshipSalaryUsdtOnAssetHubFromApi,
} = require("../apis/treasury/polkadot/fellowshipSalaryOnAssetHub");
const {
  getAmbassadorTreasuryOnAssetHubFromApi,
} = require("../apis/treasury/polkadot/ambassadorTreasuryOnAssetHub");
const {
  getTreasuryOnAssetHubFromApi,
} = require("../apis/treasury/polkadot/treasuryOnAssetHub");
const {
  getMythTreasuryOnMythosFromApi,
} = require("../apis/treasury/polkadot/treasuryOnMythos");
const { calcTotalBalance } = require("../apis/treasury/polkadot");
const { getTotalFiatValue, getTreasuryHistoryCol } = require("../mongo");
const { getTreasuryBalancesArray } = require("../apis/treasury");
const {
  getDotUsdtCollection,
  getMythUsdtCol,
} = require("@dotreasury/price/src/mongo");

const oneDay = 24 * 60 * 60 * 1000;

const BlockIntervals = {
  polkadot: 6,
  polkadotAssetHub: 12,
  hydradx: 12,
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

async function getTreasuryBalance(daysAgo) {
  const polkadotTreasuries = await multiApiQuery("polkadot", async (api) => {
    const blockHash = await getBlockHash(api, BlockIntervals.polkadot, daysAgo);
    const blockApi = await api.at(blockHash);

    const treasuryDotOnRelay = await getTreasuryDotOnRelayChainFromApi(
      blockApi,
    );
    const bountyTreasuryOnRelay = await getBountyTreasuryOnRelayChainFromApi(
      blockApi,
    );

    return {
      treasuryDotOnRelay,
      bountyTreasuryOnRelay,
    };
  });

  const polkadotAssetHubTreasuries = await multiApiQuery(
    "polkadotAssetHub",
    async (api) => {
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

      const mythTreasuryBalance = await getMythTreasuryOnMythosFromApi(
        blockApi,
      );

      return {
        fellowshipTreasuryDotOnAssetHub,
        fellowshipSalaryUsdtBalance,
        ambassadorTreasuryUsdtBalance,
        dotTreasuryBalanceOnAssetHub,
        usdtTreasuryBalanceOnAssetHub,
        usdcTreasuryBalanceOnAssetHub,
        mythTreasuryBalance,
      };
    },
  );

  const hydrationTreasuries = await multiApiQuery("hydradx", async (api) => {
    const blockHash = await getBlockHash(api, BlockIntervals.hydradx, daysAgo);
    const blockApi = await api.at(blockHash);

    return await getTreasuryOnHydrationFromApi(blockApi);
  });

  return {
    ...polkadotTreasuries,
    ...polkadotAssetHubTreasuries,
    ...hydrationTreasuries,
  };
}

async function normalizeBalancesItem(balance, timestamp) {
  if (["USDt", "USDC"].includes(balance.token)) {
    return {
      ...balance,
      price: 1,
    };
  }

  if (balance.token === "DOT") {
    const priceCol = await getDotUsdtCollection();
    const [tokenPrice] = await priceCol
      .find({ openTime: { $lte: timestamp } })
      .sort({ openTime: -1 })
      .limit(1)
      .toArray();
    return {
      ...balance,
      price: parseFloat(tokenPrice?.open),
      priceUpdateAt: tokenPrice?.openTime,
    };
  }

  if (balance.token === "MYTH") {
    const priceCol = await getMythUsdtCol();
    const [tokenPrice] = await priceCol
      .find({ openTime: { $lte: timestamp } })
      .sort({ openTime: -1 })
      .limit(1)
      .toArray();
    return {
      ...balance,
      price: tokenPrice?.open,
      priceUpdateAt: tokenPrice?.openTime,
    };
  }

  return balance;
}

async function generateTreasuryItemAtDaysAgo(daysAgo) {
  const onchainTreasuries = await getTreasuryBalance(daysAgo);
  const treasuryData = calcTotalBalance(onchainTreasuries);
  const balances = getTreasuryBalancesArray(treasuryData);

  const timestamp = dayjs().utc().subtract(daysAgo, "day").valueOf();
  const normalizedBalances = await Promise.all(
    balances.map((item) => normalizeBalancesItem(item, timestamp)),
  );
  if (!normalizedBalances.every((item) => item.price)) {
    return;
  }

  const totalValue = getTotalFiatValue(normalizedBalances);
  const date = dayjs().utc().subtract(daysAgo, "day").startOf("day").valueOf();

  const treasuryHistoryCol = await getTreasuryHistoryCol();
  await treasuryHistoryCol.updateOne(
    { chain: "polkadot", date },
    {
      $set: {
        balance: totalValue,
        balances: normalizedBalances,
        balanceUpdateAt: new Date(),
      },
    },
    { upsert: true },
  );
}

async function generateTreasuryHistory() {
  for (let i = 0; i < 30; i++) {
    await generateTreasuryItemAtDaysAgo(i);
  }
}

createChainApis()
  .then(generateTreasuryHistory)
  .finally(() => process.exit(0));
