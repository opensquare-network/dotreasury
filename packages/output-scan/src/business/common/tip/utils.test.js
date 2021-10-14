const { getTippersCountFromApi } = require("./utils");
const { setApi } = require("../../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

async function testTippersCount(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const tipperCount = await getTippersCountFromApi(blockHash);

  expect(tipperCount).toEqual(target);
}

describe("test tip utils", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/kusama", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("getTippersCount works", async () => {
    const data = [
      [12345, 13],
      [9623456, 19]
    ]

    for (const item of data) {
      await testTippersCount(api, item[0], item[1]);
    }
  })
})
