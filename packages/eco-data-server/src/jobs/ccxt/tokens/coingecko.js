const {
  coingeckoTokenIdMap,
  revertCoingeckoTokenIdMap,
  CHAINS,
  ChainTokenMap,
} = require("../../../consts");
const { batchUpdateTokenPrices } = require("../../../mongo");
const { upsertChainPrice } = require("../../../mongo/service");

const BASE_URL = "https://api.coingecko.com/api/v3/simple/price";
const source = "coingecko";

async function fetchCoingeckoPrices(coinIds) {
  const url = `${BASE_URL}?ids=${coinIds.join(",")}&vs_currencies=usd`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let data;
  try {
    const res = await fetch(url, { signal: controller.signal });
    data = await res.json();
  } catch (e) {
    const reason = e.name === "AbortError" ? "request timed out" : e.message;
    console.error(
      `Failed to fetch CoinGecko prices for [${coinIds.join(", ")}]: ${reason}`,
    );
    return [];
  } finally {
    clearTimeout(timeout);
  }

  return Object.entries(data).map(([coinId, priceData]) => ({
    coinId,
    price: String(priceData.usd),
    priceUpdateAt: new Date(),
  }));
}

async function updateTokenPricesByCoingecko() {
  const coinIds = Object.values(coingeckoTokenIdMap);
  const tickers = await fetchCoingeckoPrices(coinIds);
  const tokenPriceArr = tickers.map(({ coinId, price, priceUpdateAt }) => {
    const token = revertCoingeckoTokenIdMap[coinId];
    return { token, price, priceUpdateAt, source };
  });

  await batchUpdateTokenPrices(tokenPriceArr);

  for (const tokenPrice of tokenPriceArr) {
    const { token, price, priceUpdateAt } = tokenPrice;
    const chains = Object.values(CHAINS).filter(
      (chain) => ChainTokenMap[chain] === token,
    );
    for (const chain of chains) {
      await upsertChainPrice(chain, price, priceUpdateAt);
      console.log(`${chain} price by coingecko updated`);
    }
  }
}

module.exports = { updateTokenPricesByCoingecko };
