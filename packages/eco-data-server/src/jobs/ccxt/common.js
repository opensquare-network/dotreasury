async function fetchTicker(exchange, coinId) {
  let ticker;

  try {
    ticker = await exchange.fetchTicker(coinId);
  } catch (e) {
    console.log(`Failed to fetch price of ${ coinId }`, e);
    return;
  }

  if (!ticker) {
    return;
  }

  return {
    price: ticker.last,
    priceUpdateAt: ticker.last_traded_at || new Date(),
  }
}

module.exports = {
  fetchTicker,
}
