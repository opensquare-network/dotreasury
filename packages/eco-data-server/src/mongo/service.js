const { getStatusCol } = require("./index");

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

module.exports = {
  upsertChainTreasury,
  upsertChainPrice,
};
