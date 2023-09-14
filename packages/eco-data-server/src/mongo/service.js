const { getStatusCol } = require("./index");

async function upsertChainTreasury(chain, balance) {
  const col = await getStatusCol();
  await col.updateOne(
    { chain },
    { $set: { balance, balanceUpdateAt: new Date() } },
    { upsert: true }
  );
}

module.exports = {
  upsertChainTreasury,
}
