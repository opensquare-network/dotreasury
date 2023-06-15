const { getGenesisBlockIndexer } = require("../genesisBlock");
const {
  test: { setPolkadot, disconnect },
} = require("@osn/scan-common");

describe("Get genesis block indexer", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const indexer = await getGenesisBlockIndexer();
    expect(indexer).toEqual({
      "blockHeight": 1,
      "blockHash": "0xc0096358534ec8d21d01d34b836eed476a1c343f8724fa2153dc0725ad797a90",
      "blockTime": 1590507378000
    });
  });
})
