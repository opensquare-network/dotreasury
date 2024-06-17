const { removePolkadotTips } = require("./polkadot/removePolkadotTips");
const { removeKusamaTips } = require("./kusama/removeKusamaTip");

async function handleKnownBusiness(indexer) {
  await removePolkadotTips(indexer);
  await removeKusamaTips(indexer);
}

module.exports = {
  handleKnownBusiness,
}
