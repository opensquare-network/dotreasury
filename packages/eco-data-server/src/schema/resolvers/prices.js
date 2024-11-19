const { getPriceCol } = require("../../mongo");

async function prices(_, _args) {
  const { symbol } = _args;
  const col = await getPriceCol();
  const q = {};
  if (symbol) {
    Object.assign(q, { token: symbol });
  }

  const tokens = await col.find(q, { projection: { _id: 0 } }).toArray();
  return tokens.map(treasury => {
    return {
      ...treasury,
      symbol: treasury.token,
      priceUpdateAt: treasury.priceUpdateAt.getTime(),
    }
  });
}

module.exports = {
  prices,
}
