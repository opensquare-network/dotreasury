const { kraken: Kraken } = require("ccxt");

const kraken = new Kraken();

async function fetchKrakenTicker(coinId) {
  let ticker;

  try {
    ticker = await kraken.fetchTicker(coinId);
  } catch (e) {
    console.log(`Failed to fetch price of ${ coinId } from kraken`, e);
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
  fetchKrakenTicker,
}
