const {
  chain: {
    getApi,
    setSpecHeights,
  },
  test: { disconnect, setPolkadot }
} = require("@osn/scan-common");
const { getTipReason } = require("../utils");
jest.setTimeout(3000000);

describe("test get tip", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("reason works", async () => {
    const api = await getApi();
    const height = 7650213;
    await setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const reason = await getTipReason(
      blockHash,
      "0x1a9d6566627b4317e4f3d55b22d28ff005c33cab5c25a6609f9dafb2a3abbf64",
    );
    expect(reason).toEqual("The story of Gavin Wood (Ep.2) — The man who founded Ethereum and Polkadot https://www.youtube.com/watch?v=Ch510RA9HFU&t=4s");
  });
});
