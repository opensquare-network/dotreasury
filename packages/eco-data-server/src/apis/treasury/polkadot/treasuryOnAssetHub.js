const { multiApiQuery } = require("./common");
const { USDT_ASSET_ID, USDC_ASSET_ID } = require("./consts");

const AssetHubTreasuryAccount =
  "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";

async function getAssetHubTreasuryAccount(api) {
  const account = await api.query.system.account(AssetHubTreasuryAccount);
  return account.toJSON();
}

async function getAssetHubAssetTreasuryBalance(api, assetId) {
  const account = await api.query.assets.account(
    assetId,
    AssetHubTreasuryAccount,
  );
  return account.toJSON();
}

async function getTreasuryOnAssetHubFromApi(api) {
  const dotTreasuryBalanceOnAssetHub = await getAssetHubTreasuryAccount(api);
  const usdtTreasuryBalanceOnAssetHub = await getAssetHubAssetTreasuryBalance(
    api,
    USDT_ASSET_ID,
  );
  const usdcTreasuryBalanceOnAssetHub = await getAssetHubAssetTreasuryBalance(
    api,
    USDC_ASSET_ID,
  );

  return {
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
  };
}

async function getTreasuryOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getTreasuryOnAssetHubFromApi(api),
  );
}

module.exports = {
  getTreasuryOnAssetHub,
  getTreasuryOnAssetHubFromApi,
};
