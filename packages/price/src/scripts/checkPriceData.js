require("dotenv").config();

const dayjs = require("dayjs");
const {
  getDotUsdtCollection,
  getKsmUsdtCollection,
  getCfgUsdtCol,
  getMythUsdtCol,
} = require("../mongo");
const { sendFeishuNotification } = require("../utils/feishu");

async function getPriceCol(symbol) {
  if (symbol === "DOT") {
    return await getDotUsdtCollection();
  } else if (symbol === "KSM") {
    return await getKsmUsdtCollection();
  } else if (symbol === "CFG") {
    return await getCfgUsdtCol();
  } else if (symbol === "MYTH") {
    return await getMythUsdtCol();
  } else {
    throw new Error("Unsupported symbol: " + symbol);
  }
}

async function checkTokenPrice(symbol) {
  const priceCol = await getPriceCol(symbol);

  // Get earliest openTime from priceCol
  const earliestDoc = await priceCol.findOne({}, { sort: { openTime: 1 } });
  if (!earliestDoc) {
    console.log(`No data found for symbol: ${symbol}`);
    return;
  }

  const earliestOpenTime = earliestDoc.openTime;

  let numOfDays = 0;
  let latestDay = dayjs().subtract(1, "hour");
  while (true) {
    const theDay = latestDay.subtract(numOfDays, "day");
    const timestampStart = theDay.startOf("day").valueOf();
    if (timestampStart < earliestOpenTime) {
      console.log(
        `Finish checking price data. Reached earliest data for ${symbol} on ${dayjs(
          earliestOpenTime,
        ).format("YYYY-MM-DD")}`,
      );
      break;
    }

    const timestampEnd = theDay.endOf("day").valueOf();
    const exists = await priceCol.findOne({
      openTime: { $gte: timestampStart, $lte: timestampEnd },
    });
    if (!exists) {
      const message = `Missing ${symbol} price data on ${theDay.format(
        "YYYY-MM-DD",
      )}`;
      console.log(message);
      await sendFeishuNotification(message);

      // We don't need to check further days if we found a missing day
      break;
    }

    numOfDays++;
  }
}

const symbols = [
  "DOT", // polkadot
  "KSM", // kusama
  // "CFG", // centrifuge
  // "MYTH", // mythos
];

async function main() {
  for (const symbol of symbols) {
    try {
      console.log(`Checking price data for ${symbol}...`);
      await checkTokenPrice(symbol);
    } catch (error) {
      const message = `Error checking price data for ${symbol}: ${error.message}`;
      console.error(message);
      await sendFeishuNotification(message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
