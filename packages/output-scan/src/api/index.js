const { ApiPromise, WsProvider } = require("@polkadot/api");

let provider = null;
let api = null;

async function getApi() {
  if (!api) {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error("WS_ENDPOINT not set");
    }

    provider = new WsProvider(wsEndpoint, 1000);
    api = await ApiPromise.create({ provider });
    console.log(`Connected to endpoint:`, wsEndpoint);
  }

  return api;
}

// For test
function setApi(targetApi) {
  api = targetApi;
}

async function disconnect() {
  if (provider) {
    await provider.disconnect();
  }
}

// for test
function setProvider(p) {
  provider = p;
}

// for test
function getProvider() {
  return provider;
}

module.exports = {
  getApi,
  setProvider,
  getProvider,
  disconnect,
  setApi,
};
