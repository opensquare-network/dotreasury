const { queryPreimageCall } = require("../preimage");
const {
  consts: { Modules, TreasuryProposalMethods },
  chain: {
    getApi,
  },
  test: { setPolkadot, disconnect }
} = require("@osn/scan-common");
jest.setTimeout(3000000);

describe("Preimage", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("to approve polkadot davos query successfully", async () => {
    const blockHeight = 10483200;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const hash = "0x9c75ff75f19a086c8c21aa79e0e2ca004459fbdc717a7fae54a28d05a5e12c4a";
    const call = await queryPreimageCall(hash, { blockHash });
    const { section, method } = call;
    expect(section).toEqual(Modules.Treasury);
    expect(method).toEqual(TreasuryProposalMethods.approveProposal);
    expect(call.args[0].toJSON()).toEqual(118);
  })
})
