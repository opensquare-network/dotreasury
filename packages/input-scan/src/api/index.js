const { currentChain } = require("../env");
const { ApiPromise, WsProvider } = require("@polkadot/api");

let provider = null;
let api = null;

const defaultEndPoint = {
  kusama: "wss://pub.elara.patract.io/kusama",
  polkadot: "wss://pub.elara.patract.io/polkadot",
};

function getEndPoint() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return process.env.KSM_WS_ENDPOINT || defaultEndPoint.kusama;
  } else {
    return process.env.DOT_WS_ENDPOINT || defaultEndPoint.polkadot;
  }
}

async function getApi() {
  if (!api) {
    provider = new WsProvider(getEndPoint(), 1000);
    api = await ApiPromise.create({ provider });
  }

  return api;
}

// For test
function setApi(targetApi) {
  api = targetApi;
}

// for test
function setProvider(p) {
  provider = p;
}

// for test
function getProvider() {
  return provider;
}

async function disconnect() {
  if (provider) {
    await provider.disconnect();
  }
}

module.exports = {
  getApi,
  setProvider,
  getProvider,
  disconnect,
  setApi,
};
