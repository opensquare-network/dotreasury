const { getAssetHubApi } = require("./api");
require("bignumber.js")
const { getStatusCollection } = require("../../mongo");
const { CronJob } = require("cron");
const {
  env: { currentChain },
  consts: {
    CHAINS,
  }
} = require("@osn/scan-common");

const account = "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";
const usdtAssetId = 1984;
const usdcAssetId = 1337;

async function queryAsset(api, assetId) {
  const optionalStorage = await api.query.assets.account(assetId, account);
  if (optionalStorage.isNone) {
    return 0;
  }

  return optionalStorage.unwrap().balance.toString();
}

async function queryDot(api) {
  const storage = await api.query.system.account(account);
  const { free, reserved } = storage.data;
  return (free.toBigInt() + reserved.toBigInt()).toString();
}

async function saveAssetHubStats(obj) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: "assethub-treasury-stats" },
    { $set: { value: obj } },
    { upsert: true }
  );
}

async function queryAndSaveAssetHubAssets() {
  const api = await getAssetHubApi();
  const usdt = await queryAsset(api, usdtAssetId);
  const usdc = await queryAsset(api, usdcAssetId);
  const dot = await queryDot(api);

  await saveAssetHubStats({ usdt, usdc, dot });
}

function startAssetHubJob() {
  if (CHAINS.POLKADOT === currentChain()) {
    new CronJob("0 */1 * * * *", queryAndSaveAssetHubAssets, null, true, "Asia/Shanghai");
  }
}

module.exports = {
  queryAndSaveAssetHubAssets,
  startAssetHubJob,
}
