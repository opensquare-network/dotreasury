const { ApiPromise, WsProvider } = require("@polkadot/api");

let provider = null;
let api = null;

async function getApi() {
  if (!api) {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error("WS_ENDPOINT not set");
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint, 1000);
    api = await ApiPromise.create({ provider });
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

module.exports = {
  getApi,
  disconnect,
  setApi,
};
