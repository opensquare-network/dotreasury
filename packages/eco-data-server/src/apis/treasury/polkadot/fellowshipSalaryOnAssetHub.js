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

async function getFellowshipSalaryUsdtOnAssetHubFromApi(api) {
  return getAssetHubSalaryAsset(api, USDT_ASSET_ID);
}

async function getFellowshipSalaryUsdtOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getFellowshipSalaryUsdtOnAssetHubFromApi(api),
  );
}

module.exports = {
  getFellowshipSalaryUsdtOnAssetHub,
  getFellowshipSalaryUsdtOnAssetHubFromApi,
};
