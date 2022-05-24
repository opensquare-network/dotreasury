const { getChildBounty, getChildBountyDescriptions } = require("../child-bounty");
const {
  chain: {
    getApi,
  },
  test: { setPolkadot, disconnect }
} = require("@osn/scan-common");

describe("Child bounty", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("0 of polkadot query works", async () => {
    const blockHeight = 10172818;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const bounty = await getChildBounty(11, 0, { blockHeight, blockHash });
    expect(bounty).toEqual({
      "parentBounty": 11,
      "value": 1400000000000,
      "fee": 0,
      "curatorDeposit": 0,
      "status": {
        "added": null
      }
    })
  })

  test("0 descriptions query works", async () => {
    const blockHeight = 10172818;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const descriptions = await getChildBountyDescriptions(0, { blockHeight, blockHash })
    expect(descriptions).toEqual("Child Bounty 1 - March 2022 - Dubstard");
  })
})
