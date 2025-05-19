const { multiApiQuery } = require("./common");

const AssetHubFellowShipTreasuryAccount =
  "16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos";

async function getFellowshipTreasuryDotOnAssetHubFromApi(api) {
  const account = await api.query.system.account(
    AssetHubFellowShipTreasuryAccount,
  );
  return account.toJSON();
}

async function getFellowshipTreasuryDotOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getFellowshipTreasuryDotOnAssetHubFromApi(api),
  );
}

module.exports = {
  getFellowshipTreasuryDotOnAssetHub,
  getFellowshipTreasuryDotOnAssetHubFromApi,
};
