const { setApi } = require("../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");
const { getTreasuryBalanceV2: getBalance } = require("../../utils/freeBalance");

describe("test get balance", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://polkadot.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("of polkadot at 6566400 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6566400);
    const balance = await getBalance(blockHash);

    expect(balance).toEqual("175193604675239475");
  });

  test("of polkadot at 345600 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(345600);

    const balance = await getBalance(blockHash);
    expect(balance).toEqual("34604550100317820");
  });
});
