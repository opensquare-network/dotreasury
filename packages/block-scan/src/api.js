const { ApiPromise, WsProvider } = require("@polkadot/api");

let provider = null;
let api = null;

const defaultKsmEndPoint = "wss://kusama.elara.patract.io/";

async function getApi() {
  if (!api) {
    const ws_endpoint = process.env.WS_ENDPOINT || defaultKsmEndPoint;
    provider = new WsProvider(ws_endpoint);
    api = await ApiPromise.create({ provider });
  }

  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

module.exports = {
  getApi,
  disconnect,
};
