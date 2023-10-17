const fetch = require("node-fetch");
const AbortController = require("abort-controller");
const BigNumber = require("bignumber.js");

async function getKlinesFromCoinGecko(startTime = '1582329600', lastPrice) {
  const url = new URL("/api/v3/coins/centrifuge/market_chart/range", "https://api.coingecko.com");
  url.searchParams.set("vs_currency", `usd`);
  url.searchParams.set("from", `${ startTime }`);
  const to = parseInt(startTime) + 18000;
  url.searchParams.set("to", `${ to }`);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const result = await res.json();
    const prices = result?.prices || [];
    if (prices.length <= 0 && lastPrice) {
      return [[new BigNumber(to).multipliedBy(1000).toString(), lastPrice]];
    } else {
      return prices;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("request was aborted");
    }
  } finally {
    clearTimeout(timeout);
  }

  return [];
}

module.exports = {
  getKlinesFromCoinGecko,
};
