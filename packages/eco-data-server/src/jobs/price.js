const { endpoints } = require("../apis/endpoints");
const { upsertChainPrice } = require("../mongo/service");

async function coingeckoGet(api) {
  const url = `https://api.coingecko.com/api/${api}`;

  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 15 * 1000);
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${api}`);
  }
  return await resp.json();
}

async function fetchCoinList() {
  return await coingeckoGet("v3/coins/list");
}

async function fetchPrice(coinId) {
  return await coingeckoGet(`v3/coins/${coinId}/tickers`);
}

async function updateTokenPrice(chain, coinId) {
  const data = await fetchPrice(coinId);
  const ticker = data?.tickers?.find(
    (item) => item.coin_id === coinId && item.target === "USD",
  );
  if (!ticker) {
    return;
  }
  const price = ticker.last;
  const priceUpdateAt = ticker.last_traded_at;

  await upsertChainPrice(chain, price, priceUpdateAt);
}

async function updateTokensPrice() {
  const chains = Object.keys(endpoints);
  try {
    const coinList = await fetchCoinList();

    const promises = [];
    for (const chain of chains) {
      const coin = coinList.find(
        (item) => item.id === chain || item.name.toLowerCase() === chain,
      );
      if (!coin) {
        continue;
      }
      promises.push(updateTokenPrice(chain, coin.id));
    }
    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(updateTokensPrice, 60 * 1000);
  }
}

module.exports = {
  updateTokensPrice,
};
