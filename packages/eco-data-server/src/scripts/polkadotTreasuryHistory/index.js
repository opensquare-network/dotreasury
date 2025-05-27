require("dotenv").config();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const pick = require("lodash.pick");
const { createChainApis } = require("../../apis");
const { endpoints } = require("../../apis/endpoints");

const { calcTotalBalance } = require("../../apis/treasury/polkadot");
const { getTotalFiatValue, getTreasuryHistoryCol } = require("../../mongo");
const { getTreasuryBalancesArray } = require("../../apis/treasury");
const {
  getDotUsdtCollection,
  getMythUsdtCol,
} = require("@dotreasury/price/src/mongo");
const { getTreasuryBalance } = require("./getTreasuryBalance");

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

async function generateTreasuryHistoryItem(daysAgo) {
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
    await generateTreasuryHistoryItem(i);
  }
}

createChainApis(pick(endpoints, ["polkadot", "polkadotAssetHub", "hydradx"]))
  .then(generateTreasuryHistory)
  .catch(console.error)
  .finally(() => process.exit(0));
