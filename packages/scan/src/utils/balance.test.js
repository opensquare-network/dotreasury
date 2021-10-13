const { setApi } = require("../api");
const { getTreasuryBalanceV2 } = require("./freeBalance");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

async function testHeightBalance(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const balance = await getTreasuryBalanceV2(blockHash);
  expect(balance).toEqual(target);
}

describe("test get treasury", () => {
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

  test('balance works', async () => {
    const arr = [
      [602672, '70192029447503133'],
      [9632956, '443593060123029629']
    ]

    for (const item of arr) {
      await testHeightBalance(api, item[0], item[1])
    }
  })
})
