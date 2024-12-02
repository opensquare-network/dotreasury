const { multiApiQuery } = require("./common");

const AssetHubFellowShipTreasuryAccount =
  "16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos";

async function getAssetHubFellowshipTreasuryAccount(api) {
  const account = await api.query.system.account(
    AssetHubFellowShipTreasuryAccount,
  );
  return account.toJSON();
}

async function getFellowshipTreasuryDotOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getAssetHubFellowshipTreasuryAccount(api),
  );
}

module.exports = {
  getFellowshipTreasuryDotOnAssetHub,
};
