const { endpoints, CHAINS } = require("../apis/endpoints");
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

async function fetchPrice(coinId) {
  return await coingeckoGet(`v3/coins/${coinId}/tickers`);
}

async function updateTokenPrice(chain, coinId) {
  let data;
  try {
    data = await fetchPrice(coinId);
  } catch (e) {
    console.log(`Failed to fetch price of ${ chain }`);
    return;
  }

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

function getCoinId(chain) {
  if (["phala", "khala"].includes(chain)) {
    return "pha";
  } else if ([CHAINS.bifrostPolkadot].includes(chain)) {
    return "bifrost-native-coin";
  }
  return chain;
}

async function updateTokensPrice() {
  const chains = Object.keys(endpoints);
  try {
    const promises = [];
    for (const chain of chains) {
      const coinId = getCoinId(chain);
      promises.push(updateTokenPrice(chain, coinId));
    }
    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(updateTokensPrice, 180 * 1000);
  }
}

module.exports = {
  updateTokensPrice,
};
