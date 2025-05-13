const { multiApiQuery } = require("./common");
const { USDT_ASSET_ID } = require("./consts");

const AssetHubAmbassadorTreasuryAccount =
  "13wa8ddUNUhXnGeTrjYH8hYXF2jNdCJvgcADJakNvtNdGozX";

async function getAssetHubAsset(api, assetId) {
  const account = await api.query.assets.account(
    assetId,
    AssetHubAmbassadorTreasuryAccount,
  );
  return account.toJSON();
}

async function getAmbassadorTreasuryOnAssetHub() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getAssetHubAsset(api, USDT_ASSET_ID),
  );
}

module.exports = {
  getAmbassadorTreasuryOnAssetHub,
};
