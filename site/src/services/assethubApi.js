import { ApiPromise, WsProvider } from "@polkadot/api";
import { currentChainSettings } from "../utils/chains";

let api = null;
let provider = null;

function getEndPoints() {
  const wsEndpoints = currentChainSettings?.assetHubEndpoints?.map(
    (item) => item.url,
  );
  if (!wsEndpoints) {
    throw new Error("AssetHub endpoints not found");
  }

  return wsEndpoints;
}

/**
 * @returns {Promise<ApiPromise>}
 */
export async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const endpoints = getEndPoints();
  provider = new WsProvider(endpoints, 1000);
  api = await ApiPromise.create({ provider });

  return api;
}
