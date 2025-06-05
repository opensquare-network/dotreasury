const BigNumber = require("bignumber.js");
const { getStatusCol, getPriceCol, getTreasuryHistoryCol } = require("./db");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

async function normalizeBalancesItem(balance) {
  if (["USDt", "USDC"].includes(balance.token)) {
    return {
      ...balance,
      price: 1,
    };
  }

  const priceCol = await getPriceCol();
  const tokenPrice = await priceCol.findOne({ token: balance.token });
  if (!tokenPrice) {
    return balance;
  }

  return {
    ...balance,
    price: tokenPrice.price,
    priceUpdateAt: tokenPrice.priceUpdateAt.getTime(),
  };
}

function getTotalFiatValue(normalizedBalances) {
  return normalizedBalances
    .reduce(
      (acc, item) =>
        new BigNumber(item.balance)
          .div(Math.pow(10, item.decimals))
          .times(item.price)
          .plus(acc),
      new BigNumber(0),
    )
    .toNumber();
}

async function upsertChainTreasuryWithDetail(chain, balance, balances) {
  const now = new Date();
  const col = await getStatusCol();
  await col.updateOne(
    { chain },
    { $set: { balance, balances, balanceUpdateAt: now } },
    { upsert: true },
  );

  const normalizedBalances = await Promise.all(
    balances.map((item) => normalizeBalancesItem(item)),
  );
  if (!normalizedBalances.every((item) => item.price)) {
    return;
  }

  const totalValue = getTotalFiatValue(normalizedBalances);
  const date = dayjs().utc().startOf("day").valueOf();
  const treasuryHistoryCol = await getTreasuryHistoryCol();
  await treasuryHistoryCol.updateOne(
    { chain, date },
    {
      $set: {
        balance: totalValue,
        balances: normalizedBalances,
        balanceUpdateAt: now,
      },
    },
    { upsert: true },
  );
}

async function upsertChainTreasury(chain, balance) {
  const col = await getStatusCol();
  await col.updateOne(
    { chain },
    { $set: { balance, balanceUpdateAt: new Date() } },
    { upsert: true },
  );
}

async function upsertChainPrice(chain, price, priceUpdateAt) {
  const col = await getStatusCol();
  await col.updateOne(
    { chain },
    { $set: { price, priceUpdateAt: new Date(priceUpdateAt) } },
    { upsert: true },
  );
}

async function upsertTokenPrice(token, price, priceUpdateAt, source) {
  const col = await getPriceCol();
  await col.updateOne(
    { token },
    { $set: { price, priceUpdateAt: new Date(priceUpdateAt), source } },
    { upsert: true },
  );
}

async function batchUpdateTokenPrices(arr = []) {
  if (arr.length <= 0) {
    return;
  }

  const col = await getPriceCol();
  const bulk = col.initializeUnorderedBulkOp();
  for (const item of arr) {
    const { token, price, priceUpdateAt, source } = item;
    bulk
      .find({ token })
      .upsert()
      .updateOne({ $set: { token, price, priceUpdateAt, source } });
  }

  await bulk.execute();
}

module.exports = {
  upsertChainTreasury,
  upsertChainTreasuryWithDetail,
  upsertChainPrice,
  upsertTokenPrice,
  batchUpdateTokenPrices,
  normalizeBalancesItem,
  getTotalFiatValue,
};
