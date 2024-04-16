const { CHAINS } = require("../apis/endpoints");
const { upsertChainPrice } = require("../mongo/service");
const { gateCoinIdMap } = require("./ccxt/gate");
const { CronJob } = require("cron");

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
    (item) => item.coin_id === coinId && item.target === "USDT",
  );
  if (!ticker) {
    return;
  }
  const price = ticker.last;
  const priceUpdateAt = ticker.last_traded_at;

  await upsertChainPrice(chain, price, priceUpdateAt);
  console.log(`${ chain } price by coingecko updated`);
}

function getCoinId(chain) {
  if (["phala", "khala"].includes(chain)) {
    return "pha";
  } else if ([CHAINS.bifrost].includes(chain)) {
    return "bifrost-native-coin";
  } else if ([CHAINS.darwinia].includes(chain)) {
    return "darwinia-network-native-token";
  }
  return chain;
}

async function updateTokensPrice() {
  const chains = Object.keys(CHAINS);
  const chainsByGate = Object.keys(gateCoinIdMap);
  const filteredChains = chains.filter(c => !chainsByGate.includes(c));

  const promises = [];
  for (const chain of filteredChains) {
    const coinId = getCoinId(chain);
    promises.push(updateTokenPrice(chain, coinId));
  }
  await Promise.all(promises);
}

function startCoingeckoTickerCronJob() {
  new CronJob("0 */3 * * * *", updateTokensPrice, null, true, "Asia/Shanghai");
}

module.exports = {
  updateTokensPrice,
  startCoingeckoTickerCronJob,
};
