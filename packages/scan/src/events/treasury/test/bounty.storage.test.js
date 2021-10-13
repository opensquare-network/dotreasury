const { getBountyMeta, getBountyDescription } = require("../bounty/utils");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get bounties", () => {
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
    const blockHash = await api.rpc.chain.getBlockHash(4501546);

    const meta = await getBountyMeta(blockHash, 0);
    expect(meta).toMatchObject({
      proposer: "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      value: 1165000000000000,
      fee: 0,
      curatorDeposit: 0,
      bond: 206666666650,
      status: {
        proposed: null,
      },
    });
  });

  test("#3 of kusama works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6346948);

    const meta = await getBountyMeta(blockHash, 3);
    expect(meta).toMatchObject({
      proposer: "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y",
      value: 1111000000000000,
      fee: 0,
      curatorDeposit: 0,
      bond: 301666666612,
      status: {
        proposed: null,
      },
    });
  });

  test("#0 description of kusama works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(4501546);
    const description = await getBountyDescription(blockHash, 0);

    expect(description).toEqual("Kusama network UI Bounty");
  });

  test("#4 description of kusama works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6924780);
    const description = await getBountyDescription(blockHash, 4);

    expect(description).toEqual("Council Alert App");
  });
});
