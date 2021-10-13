const { getMotionVoting } = require("./utils");
const { setApi } = require("../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get council", () => {
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

  test('motion works', async () => {
    const height = 126209;
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const motionHash = "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";

    const voting = await getMotionVoting(blockHash, motionHash)
    console.log(voting)
    expect(voting).toEqual({
      "index": 15,
      "threshold": 8,
      "ayes": [
        "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y"
      ],
      "nays": []
    })
  })
})
