jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");
const { getTreasuryBalance: getBalance } = require("../../utils/freeBalance");
const { bnToBn } = require("@polkadot/util");

describe("test get balance", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://polkadot.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("of polkadot at 6566400 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6566400);
    const metadata = await api.rpc.state.getMetadata(blockHash);

    const balance = await getBalance(api, metadata, blockHash);

    expect(bnToBn(balance).toString()).toEqual("175193604675239475");
  });

  test("of polkadot at 345600 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(345600);

    const metadata = await api.rpc.state.getMetadata(blockHash);

    const balance = await getBalance(api, metadata, blockHash);
    expect(bnToBn(balance).toString()).toEqual("34604550100317820");
  });
});
