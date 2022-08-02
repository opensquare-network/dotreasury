const { getReferendumInfoFromStorage } = require("../referendum");
const {
  chain: {
    getApi,
  },
  test: { setPolkadot, disconnect }
} = require("@osn/scan-common");

describe("Referendum", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("64 of polkadot query works", async () => {
    const blockHeight = 10483200;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const referendumInfo = await getReferendumInfoFromStorage(64, { blockHash });
    expect(referendumInfo).toEqual({
      "ongoing": {
        "end": 10886400,
        "proposalHash": "0x9c75ff75f19a086c8c21aa79e0e2ca004459fbdc717a7fae54a28d05a5e12c4a",
        "threshold": "SimpleMajority",
        "delay": 403200,
        "tally": {
          "ayes": 0,
          "nays": 0,
          "turnout": 0
        }
      }
    });
  })
})
