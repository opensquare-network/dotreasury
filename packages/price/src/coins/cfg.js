const dotenv = require("dotenv");
dotenv.config();

const { getCfgUsdtCol } = require("../mongo");
const { getLatestPrice } = require("../utils/getLatestPrice");
const { getKlinesFromCoinGecko } = require("./coinGecko");
const { saveCoinGeckoKlines } = require("./save");
const dayjs = require("dayjs");
const { sleep } = require("../utils/sleep");

async function tick() {
  const col = await getCfgUsdtCol();

  const latestItem = await getLatestPrice();
  let klines;
  if (latestItem) {
    const nextStartTime = latestItem.openTime + 1;
    klines = await getKlinesFromCoinGecko(nextStartTime);
  } else {
    klines = await getKlinesFromCoinGecko('1622160000');
  }
  await saveCoinGeckoKlines(col, klines);

  return klines?.[klines.length - 1]?.[0] || latestItem?.openTime;
}

async function main() {
  while (true) {
    let latestOpenTime = null;

    try {
      latestOpenTime = await tick();
      console.log(`CFG price saved: ${ dayjs(latestOpenTime).format("YYYY-MM-DD HH:mm:ss") }`);
    } catch (e) {
      console.error(e.message);
    }

    // Reduce the call rate when the latest open time is very close to the current time,
    if (
      latestOpenTime &&
      dayjs(latestOpenTime).add(5, "m").toDate().getTime() > Date.now()
    ) {
      await sleep(60 * 1000);
    } else {
      await sleep(2 * 1000);
    }
  }
}

main().catch(console.error);
