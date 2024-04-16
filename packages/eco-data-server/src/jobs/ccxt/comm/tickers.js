async function fetchTickers(exchange, symbols) {
  let tickers;

  try {
    tickers = await exchange.fetchTickers(symbols);
  } catch (e) {
    console.log(`Failed to fetch price of ${ JSON.stringify(symbols) }`, e);
    return;
  }

  return (Object.values(tickers) || []).map(ticker => {
    const { symbol, last, last_traded_at } = ticker;
    return {
      symbol,
      price: last,
      priceUpdateAt: last_traded_at || new Date(),
    }
  });
}

module.exports = {
  fetchTickers,
}
