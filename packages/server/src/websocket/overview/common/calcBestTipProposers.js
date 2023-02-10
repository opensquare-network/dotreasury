const {
  getTipFinderCollection,
} = require("../../../mongo");
const { bigAdd } = require("../../../utils");
const { addUsdtValue } = require("./utils");

async function saveFinders(finders, chain) {
  const tipFinderCol = await getTipFinderCollection(chain);
  for (const item of finders) {
    await tipFinderCol.updateOne(
      { finder: item.finder },
      { $set: item },
      { upsert: true }
    );
  }
}

function sortByCount(arr) {
  return arr.sort((a, b) => {
    return Number(b.count) - Number(a.count);
  });
}

function calcBestTipProposers(chain, tips = []) {
  const closedTips = tips.filter(
    ({ state: { state } }) => state === "TipClosed"
  );
  const map = {};
  for (const { finder, medianValue, symbolPrice } of closedTips) {
    const tipMedianValue = medianValue || 0;
    const perhaps = map[finder];
    const tipValue = perhaps ? bigAdd(perhaps.value, tipMedianValue) : tipMedianValue;
    const tipFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      tipMedianValue,
      symbolPrice || 0,
      chain
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[finder] = { value: tipValue, fiatValue: tipFiatValue, count };
  }

  const finders = Object.entries(map).map(
    ([finder, { value, fiatValue, count }]) => {
      return {
        finder,
        value,
        fiatValue: fiatValue.toNumber(),
        count,
      };
    }
  );

  saveFinders(finders, chain).catch(console.error);

  return sortByCount(finders).slice(0, 10);
}

module.exports = {
  calcBestTipProposers,
};
