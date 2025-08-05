import { ApiPromise, WsProvider } from "@polkadot/api";

const runtimeApiTypes = {
  PalletCurrenciesRpcRuntimeApiAccountData: {
    free: "Balance",
    reserved: "Balance",
    frozen: "Balance",
  },
};

const runtimeApiMethods = {
  CurrenciesApi: {
    account: {
      description: "Query account data for a specific currency",
      params: [
        { name: "account_id", type: "AccountId" },
        { name: "currency_id", type: "CurrencyId" },
      ],
      type: "PalletCurrenciesRpcRuntimeApiAccountData",
    },
  },
};

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

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const endpoints = getEndPoints();
  provider = new WsProvider(endpoints, 1000);

  api = await ApiPromise.create({
    provider,
    types: runtimeApiTypes,
  });

  api.registry.register(runtimeApiMethods);

  return api;
}
