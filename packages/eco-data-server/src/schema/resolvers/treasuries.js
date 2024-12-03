const { getStatusCol, getPriceCol } = require("../../mongo");

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

async function normalizeTreasury(treasury) {
  const balances =
    treasury.balances &&
    (await Promise.all(
      treasury.balances.map((item) => normalizeBalancesItem(item)),
    ));

  return {
    ...treasury,
    balances,
    balanceUpdateAt: treasury.balanceUpdateAt.getTime(),
  };
}

async function treasuries(_, _args) {
  const { chain } = _args;
  const col = await getStatusCol();
  const q = {};
  if (chain) {
    Object.assign(q, { chain });
  }

  const treasuries = await col.find(q, { projection: { _id: 0 } }).toArray();
  const filtered = treasuries.filter(
    (item) => !["polkadotAssetHub", "mythos"].includes(item.chain),
  );

  return await Promise.all(
    filtered.map(async (treasury) => normalizeTreasury(treasury)),
  );
}

module.exports = {
  treasuries,
};
