const { getProposalMeta } = require("../utils");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get treasury proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("#0 of kusama works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(126165);

    const meta = await getProposalMeta(blockHash, 0);
    expect(meta).toMatchObject({
      proposer: "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y",
      value: 50000000000000,
      beneficiary: "EaG2CRhJWPb7qmdcJvy3LiWdh26Jreu9Dx6R1rXxPmYXoDk",
      bond: 2500000000000,
    });
  });

  test("#100 of kusama works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(8463915);
    const metadata = await api.rpc.state.getMetadata(blockHash);

    const meta = await getProposalMeta(blockHash, 100);
    expect(meta).toMatchObject({
      proposer: "ELkVhHcvaP9L43RK9SP6Wn3FBfusEN5EJe2gH7aA2ETiufP",
      value: 47419900000000,
      beneficiary: "E5S77xkFnRBq3qwDaRgdo1uuB1LXXy72RzsSBdQoLL3HTZJ",
      bond: 2370995000000,
    });
  });
});
