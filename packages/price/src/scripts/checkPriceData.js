require("dotenv").config();

const minimist = require("minimist");
const dayjs = require("dayjs");
const {
  getDotUsdtCollection,
  getKsmUsdtCollection,
  getCfgUsdtCol,
  getMythUsdtCol,
} = require("../mongo");
const { sendFeishuNotification } = require("../utils/feishu");

const args = minimist(process.argv.slice(2));

if (!args.symbol) {
  console.log("Must specify symbol with argument --symbol=[DOT|KSM|CFG|MYTH]");
  return;
}

async function getPriceCol() {
  if (args.symbol === "DOT") {
    return await getDotUsdtCollection();
  } else if (args.symbol === "KSM") {
    return await getKsmUsdtCollection();
  } else if (args.symbol === "CFG") {
    return await getCfgUsdtCol();
  } else if (args.symbol === "MYTH") {
    return await getMythUsdtCol();
  } else {
    throw new Error("Unsupported symbol: " + args.symbol);
  }
}

async function main() {
  const priceCol = await getPriceCol();

  // Get earliest openTime from priceCol
  const earliestDoc = await priceCol.findOne({}, { sort: { openTime: 1 } });
  if (!earliestDoc) {
    console.log(`No data found for symbol: ${args.symbol}`);
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
        `Finish checking price data. Reached earliest data for ${
          args.symbol
        } on ${dayjs(earliestOpenTime).format("YYYY-MM-DD")}`,
      );
      break;
    }

    const timestampEnd = theDay.endOf("day").valueOf();
    const exists = await priceCol.findOne({
      openTime: { $gte: timestampStart, $lte: timestampEnd },
    });
    if (!exists) {
      const message = `Missing ${args.symbol} price data on ${theDay.format(
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

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
