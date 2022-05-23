const { setChain, CHAINS } = require("../env");
const { polkadotEndpoint } = require("./constants");
const { setProvider, setApi } = require("../chain/api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setPolkadot() {
  jest.setTimeout(3000000);
  const provider = new WsProvider(polkadotEndpoint, 1000);
  const api = await ApiPromise.create({ provider });
  setProvider(provider);
  setApi(api);
  setChain(CHAINS.POLKADOT);
}

module.exports = {
  setPolkadot,
};
