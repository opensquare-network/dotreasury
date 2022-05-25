const { utils: { bigAdd } } = require("@osn/scan-common");
const { handleEraPaid } = require("./eraPaid");
const { handleEraPayout } = require("./eraPayout");
const { handleKsmLegacyReward } = require("./ksmLegacyReward");

async function handleInflation(event, indexer, blockEvents) {
  const byReward = await handleKsmLegacyReward(...arguments);
  const byEraPayout = await handleEraPayout(...arguments);
  const byEraPaid = await handleEraPaid(...arguments);

  let result = 0;
  if (byReward) {
    result = bigAdd(result, byReward.balance);
  }
  if (byEraPayout) {
    result = bigAdd(result, byEraPayout.balance);
  }
  if (byEraPaid) {
    result = bigAdd(result, byEraPaid.balance);
  }

  return result;
}

module.exports = {
  handleInflation,
}
