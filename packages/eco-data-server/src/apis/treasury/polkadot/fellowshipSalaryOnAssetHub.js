const { multiApiQuery } = require("./common");
const { USDT_ASSET_ID } = require("./consts");

const AssetHubFellowshipSalaryAccount =
  "13w7NdvSR1Af8xsQTArDtZmVvjE8XhWNdL4yed3iFHrUNCnS";

async function getAssetHubSalaryAsset(api, assetId) {
  const account = await api.query.assets.account(
    assetId,
    AssetHubFellowshipSalaryAccount,
  );
  return account.toJSON();
}

async function getFellowshipSalaryUsdtOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getAssetHubSalaryAsset(api, USDT_ASSET_ID),
  );
}

module.exports = {
  getFellowshipSalaryUsdtOnAssetHub,
};
