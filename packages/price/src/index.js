const minimist = require("minimist");
const dayjs = require("dayjs");
const { getKlines } = require("./binance");
const { getKsmUsdtCollection, getDotUsdtCollection } = require("./mongo");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCollection(symbol) {
  if (symbol === "DOT") {
    return getDotUsdtCollection();
  } else if (symbol === "KSM") {
    return getKsmUsdtCollection();
  } else {
    throw new Error("Unsupport symbol " + symbol);
  }
}

async function saveKlines(col, klines) {
  if (klines && klines.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of klines) {
      const [
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVolume,
        takerBuyQuoteAssetVolume,
      ] = item;

      bulk.insert({
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVolume,
        takerBuyQuoteAssetVolume,
      });
    }

    await bulk.execute();
  }
}

async function tick(symbol) {
  const col = await getCollection(symbol);

  const latestItem = (
    await col.find({}).sort({ openTime: -1 }).limit(1).toArray()
  )[0];
  let klines = null;
  if (latestItem) {
    const nextStartTime = latestItem.closeTime + 1;
    klines = await getKlines(symbol, nextStartTime);
  } else {
    klines = await getKlines(symbol);
  }

  await saveKlines(col, klines);

  return klines?.[klines.length - 1]?.[0] || latestItem?.openTime;
}

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.symbol) {
    console.log("Must specify symbol with argument --symbol=[DOT|KSM]");
    return;
  }

  if (!["DOT", "KSM"].includes(args.symbol)) {
    console.log(`Unknown symbol "${args.symbol}"`);
    return;
  }

  while (true) {
    let latestOpenTime = null;

    try {
      latestOpenTime = await tick(args.symbol);
      console.log(
        `${args.symbol} price saved: ${dayjs(latestOpenTime).format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      );
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
