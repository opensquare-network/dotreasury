const { multiApiQuery } = require("../polkadot/common");

const AssetHubTreasuryAccount =
  "HWZmQq6zMMk7TxixHfseFT2ewicT6UofPa68VCn3gkXrdJF";

async function getTreasuryKsmOnAssetHubFromApi(api) {
  const account = await api.query.system.account(AssetHubTreasuryAccount);
  return account.toJSON();
}

async function getTreasuryKsmOnAssetHub() {
  return await multiApiQuery("kusamaAssetHub", (api) =>
    getTreasuryKsmOnAssetHubFromApi(api),
  );
}

module.exports = {
  getTreasuryKsmOnAssetHub,
  getTreasuryKsmOnAssetHubFromApi,
};
