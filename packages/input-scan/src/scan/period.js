const { hasPeriodMark } = require("../store/period");
const { updatePeriod, getLastPeriod } = require("../mongo/service/period");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const BigNumber = require("bignumber.js");

function bigMinus(a, b) {
  return new BigNumber(a).minus(b).toString();
}

async function savePeriodData(indexer) {
  if (!hasPeriodMark(indexer.blockHeight)) {
    return;
  }

  const lastPeriod = await getLastPeriod(indexer.blockHeight);
  const lastIncomeSeats = lastPeriod?.seats || {};
  const nowIncomeSeats = await getNowIncomeSeats();

  let income = {};
  for (const [key, value] of Object.entries(nowIncomeSeats)) {
    if (typeof value !== "object") {
      const lastValue = lastIncomeSeats[key] || 0;
      income[key] = bigMinus(value, lastValue);
    } else {
      const lastObjValue = lastIncomeSeats[key] || {};
      const innerObj = {};
      for (const [innerKey, innerValue] of Object.entries(value)) {
        innerObj[innerKey] = bigMinus(innerValue, lastObjValue[innerKey] || 0);
      }
      income[key] = innerObj;
    }
  }

  await updatePeriod(indexer.blockHeight, { income, seats: nowIncomeSeats });
}

module.exports = {
  savePeriodData,
}
