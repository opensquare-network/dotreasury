const { WsProvider, ApiPromise } = require("@polkadot/api");

let api = null;
let provider = null;

function getEndPoints() {
  const wsEndpoint = process.env.ASSET_HUB_ENDPOINTS;
  if (!wsEndpoint) {
    throw new Error("ASSET_HUB_ENDPOINTS not set");
  }

  if ((wsEndpoint || "").includes(";")) {
    return wsEndpoint.split(";");
  } else {
    return wsEndpoint;
  }
}

async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const endpoints = getEndPoints();
  provider = new WsProvider(endpoints, 1000);
  api = await ApiPromise.create({ provider });
  console.log(`Connected to asset hub endpoint:`, process.env.WS_ENDPOINT);
  return api;
}

module.exports = {
  getAssetHubApi,
}
