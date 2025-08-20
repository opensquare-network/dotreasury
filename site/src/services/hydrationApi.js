import { ApiPromise, WsProvider } from "@polkadot/api";
import { hydradx } from "../utils/chains/hydradx";

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
  const endpoints = hydradx.endpoints;
  const wsEndpoints = endpoints?.map((item) => item.url);
  if (!wsEndpoints) {
    throw new Error("Hydration endpoints not found");
  }

  return wsEndpoints;
}

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const endpoints = getEndPoints();
  provider = new WsProvider(endpoints, 1000);

  api = await ApiPromise.create({
    provider,
  });

  api.registry.register(runtimeApiTypes);
  api.registry.register(runtimeApiMethods);

  return api;
}
