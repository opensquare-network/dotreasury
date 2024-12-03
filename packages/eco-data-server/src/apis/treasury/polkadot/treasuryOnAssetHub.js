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

async function getTreasuryOnAssetHub() {
  const dotTreasuryBalanceOnAssetHub = await multiApiQuery(
    "polkadotAssetHub",
    (api) => getAssetHubTreasuryAccount(api),
  );

  const usdtTreasuryBalanceOnAssetHub = await multiApiQuery(
    "polkadotAssetHub",
    (api) => getAssetHubAssetTreasuryBalance(api, USDT_ASSET_ID),
  );

  const usdcTreasuryBalanceOnAssetHub = await multiApiQuery(
    "polkadotAssetHub",
    (api) => getAssetHubAssetTreasuryBalance(api, USDC_ASSET_ID),
  );

  return {
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
  };
}

module.exports = {
  getTreasuryOnAssetHub,
};
