const { handleEraPaid } = require("./eraPaid");
const { handleEraPayout } = require("./eraPayout");
const { handleKsmLegacyReward } = require("./ksmLegacyReward");

async function handleInflation(event, indexer, blockEvents) {
  await handleKsmLegacyReward(...arguments);
  await handleEraPayout(...arguments);
  await handleEraPaid(...arguments);
}

module.exports = {
  handleInflation,
}
