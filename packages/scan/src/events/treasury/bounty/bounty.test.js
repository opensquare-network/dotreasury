const { getBountyMeta } = require("./utils");
const { setApi } = require("../../../api");
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

  test("bounty meta works", async () => {
    const height = 4501546
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const meta = await getBountyMeta(blockHash, 0)
    expect(meta).toEqual({
      "proposer": "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      "value": 1165000000000000,
      "fee": 0,
      "curatorDeposit": 0,
      "bond": 206666666650,
      "status": {
        "proposed": null
      }
    })
  })
})
