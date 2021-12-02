const { setSpecHeights } = require("../../../chain/specs");
const { setChain, CHAINS } = require("../../../env");
const {
  getMotionVoting,
  getVotingFromStorageByHeight,
} = require("./votingStorage");
const { setApi, setProvider } = require("@dotreasury/common");
const { ApiPromise, WsProvider } = require("@polkadot/api");

jest.setTimeout(3000000);

const ksmTestMotionHash =
  "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";
const targetKsmMotion = {
  index: 15,
  threshold: 8,
  ayes: ["H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y"],
  nays: [],
};

describe("test get kusama motion voting", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/kusama", 1000);
    api = await ApiPromise.create({ provider });
    setProvider(provider)
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const blockHeight = 126209;
    await setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const voting = await getMotionVoting(indexer.blockHash, ksmTestMotionHash);
    expect(voting).toEqual(targetKsmMotion);
  });

  test("at height works", async () => {
    const blockHeight = 126209;
    await setSpecHeights([blockHeight]);

    const voting = await getVotingFromStorageByHeight(
      ksmTestMotionHash,
      blockHeight
    );
    expect(voting).toEqual(targetKsmMotion);
  });
});
