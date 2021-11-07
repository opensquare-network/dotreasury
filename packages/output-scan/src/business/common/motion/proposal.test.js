const { setSpecHeights } = require("../../../chain/specs");
const { setChain } = require("../../../env");
const { getMotionProposalCall } = require("./proposalStorage");
const { setApi, setProvider } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { CHAINS } = require("../../../env")

jest.setTimeout(3000000);

const ksmTargetCall = {
  callIndex: "0x1202",
  section: "treasury",
  method: "approveProposal",
  args: [
    {
      name: "proposalId",
      type: "Compact<ProposalIndex>",
      value: 0,
    },
  ],
};

const dotMotionCallByProxy = {
  callIndex: "0x1301",
  section: "treasury",
  method: "rejectProposal",
  args: [
    {
      name: "proposalId",
      type: "Compact<ProposalIndex>",
      value: 33,
    },
  ],
};

describe("test get kusama motion proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
    setProvider(provider);
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

    const motionHash =
      "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(ksmTargetCall);
  });
});

describe("test get polkadot motion proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://polkadot.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setProvider(provider)
    setApi(api);
    setChain(CHAINS.POLKADOT);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("by proxy works", async () => {
    const blockHeight = 3543099;
    await setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0xc117d365995214adfdd5ae55e3de4dc52dc4082e882fe2df371bf2230e01fd50";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(dotMotionCallByProxy);
  });
});
