const { setApi } = require("../api");
const { getConstFromRegistry } = require("./index");
const { findRegistry } = require("../mongo/service/specs");
const { setSpecHeights } = require("../mongo/service/specs");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get ", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider, });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("const from metadata works", async () => {
    const height = 602672;
    setSpecHeights([height]);

    const registry = await findRegistry(height);
    const v = getConstFromRegistry(registry, "Treasury", "Burn")
    expect(v.toNumber()).toEqual(0)
  })
})
