const { getReason } = require("./reason");
const { setSpecHeights } = require("../../../mongo/service/specs");
const { getTipMeta } = require("./meta");
const { setApi } = require("../../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get ", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://polkadot.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider, });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("reason maybe hex works", async () => {
    const height = 7650213;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const tipHash =
      "0xbd1aee6e756ebca427ef77d7b46c95a024bec0fece991c13e0f03048645c1cbf";

    const meta = await getTipMeta(tipHash, {
      blockHeight: height,
      blockHash,
    });

    const reason = await getReason(
      meta.reason,
      {
        blockHeight: height,
        blockHash,
      }
    );
    expect(reason).toBe('The story of Gavin Wood (Ep.2) — The man who founded Ethereum and Polkadot https://www.youtube.com/watch?v=Ch510RA9HFU&t=4s');
  });
});
