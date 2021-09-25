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
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider, });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("tip meta works", async () => {
    const height = 602672;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const tipHash =
      "0x3a8576a1d7f9110e5d13d512bb8374bc0843da026dead68707462bb7f3e448b1";
    const meta = await getTipMeta(tipHash, {
      blockHeight: height,
      blockHash,
    });
    expect(meta).toEqual({
      "reason": "0xed3ce0d332276bfa17c27431bac4d8bf1807cbbe114b0c5b1cbf0e7dc07ace47",
      "who": "HEkh52pShreLjbiGuewsnbXTeXFiq5mxqF3TffeHRjsbuN5",
      "finder": null,
      "closes": null,
      "tips": [
        [
          "FcxNWVy5RESDsErjwyZmPCW6Z8Y3fbfLzmou34YZTrbcraL",
          50000000000000
        ]
      ]
    });
  });

  test("1st reason not works", async () => {
    const height = 602672;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);


    const reason = await getReason(
      "0xb6d3c6af46ec04565e8aead8ee77f605547069eb69aad8e92a719c0c13490e5e",
      {
        blockHeight: height,
        blockHash,
      }
    );
    expect(reason).toBeNull();
  });

  test("2nd reason not works", async () => {
    const height = 714498;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const tipHash =
      "0xfe924943bb8acb5a28f4a37660d88f4262daa01b6234c393fb8b3fc315fd5429";
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
    expect(reason).toBe('https://ipfs.globalupload.io/QmS4n4ha6RVoj6FEh1MHBNuEQvhgvPNz9qQ3QDH9MTJCvC');
  });

});
