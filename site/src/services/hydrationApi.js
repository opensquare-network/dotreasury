import { ApiPromise, WsProvider } from "@polkadot/api";

let api = null;
let provider = null;

function getEndPoints() {
  const wsEndpoint = import.meta.env.VITE_APP_HYDRATION_ENDPOINTS;
  if (!wsEndpoint) {
    throw new Error("VITE_APP_HYDRATION_ENDPOINTS not set");
  }

  if ((wsEndpoint || "").includes(";")) {
    return wsEndpoint.split(";");
  } else {
    return wsEndpoint;
  }
}

/**
 * @returns {Promise<ApiPromise>}
 */
export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const endpoints = getEndPoints();
  provider = new WsProvider(endpoints, 1000);
  api = await ApiPromise.create({ provider });

  return api;
}
