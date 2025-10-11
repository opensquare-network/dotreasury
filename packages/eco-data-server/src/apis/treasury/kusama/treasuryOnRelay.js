const { multiApiQuery, getTreasuryAddress } = require("../polkadot/common");

async function getTreasuryKsmOnRelayChainFromApi(api) {
  const address = getTreasuryAddress();
  const account = await api.query.system.account(address);
  return account.toJSON();
}

async function getTreasuryKsmOnRelayChain() {
  return await multiApiQuery("kusamaAssetHub", (api) =>
    getTreasuryKsmOnRelayChainFromApi(api),
  );
}

module.exports = {
  getTreasuryKsmOnRelayChain,
  getTreasuryKsmOnRelayChainFromApi,
};
