const { getBurnPercent } = require("./burnPercent");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const {
  chain: { setApi, setProvider, },
  env: { setChain },
  consts: {
    CHAINS
  }
} = require("@osn/scan-common");

jest.setTimeout(3000000);

async function testBurnPercent(api, height, targetBurn) {
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const burnPercent = await getBurnPercent(blockHash);
  expect(burnPercent).toBe(targetBurn);
}

describe("Getting burn percent", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setProvider(provider);
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    await testBurnPercent(api, 1123200, "0.00%");
    await testBurnPercent(api, 9504000, "0.20%");
  })
})
