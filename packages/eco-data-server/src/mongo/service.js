const { getStatusCol, getPriceCol, getTreasuryHistoryCol } = require("./db");
const { CHAINS } = require("../consts");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

async function upsertChainTreasuryWithDetail(chain, balance, balances) {
  const now = new Date();
  const col = await getStatusCol();
  await col.updateOne(
    { chain },
    { $set: { balance, balances, balanceUpdateAt: now } },
    { upsert: true },
  );

  const date = dayjs().utc().startOf("day").valueOf();
  const treasuryHistoryCol = await getTreasuryHistoryCol();
  await treasuryHistoryCol.updateOne(
    { chain, date },
    {
      $set: {
        balance,
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

  // Update price to treasury history for Polkadot chain
  if (chain === CHAINS.polkadot) {
    const date = dayjs().utc().startOf("day").valueOf();
    const treasuryHistoryCol = await getTreasuryHistoryCol();
    await treasuryHistoryCol.updateOne(
      { chain, date },
      {
        $set: {
          price,
          priceUpdateAt: new Date(priceUpdateAt),
        },
      },
      { upsert: true },
    );
  }
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
};
