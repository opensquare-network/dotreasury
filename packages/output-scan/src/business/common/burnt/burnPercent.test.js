const { getBurnPercent } = require("./burnPercent");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { setApi } = require("../../../api");
const { setChain, CHAINS, } = require("../../../env");
const { setSpecHeights, } = require("../../../chain/specs");

jest.setTimeout(3000000);

async function testBurnPercent(height, targetBurn) {
  setSpecHeights([height]);
  const burnPercent = await getBurnPercent(height);
  expect(burnPercent).toBe(targetBurn);
}

describe("Getting burn percent", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    await testBurnPercent(1123200, "0.00%");
    await testBurnPercent(9504000, "0.20%");
  })
})
