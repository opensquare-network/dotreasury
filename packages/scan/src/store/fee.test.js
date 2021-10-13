const { getTippersCount } = require("./tip");
const { setSpecHeights } = require("../mongo/service/specs");
const { setApi } = require("../api");
const { getTipFindersFee } = require("./tip");
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

  test('finders fee works', async () => {
    const height = 602672;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const fee = await getTipFindersFee(blockHash)
    expect(fee).toEqual(20);
  })

  test('tippers count', async () => {
    const height = 602672;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const count = await getTippersCount(blockHash);
    expect(count).toBe(13);
  })
})
