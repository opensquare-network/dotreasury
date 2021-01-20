jest.setTimeout(30000);

const { getApi } = require("../../api");
const { 
  getExtrinsicSigner,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  median
} = require("../../utils");

test("test sleep", async () => {
  expect(await sleep(1)).toBeUndefined();
});

describe("test median", () => {
  test("test not array", () => {
    expect(median(undefined)).toBeNull();
  });
  test("test empty array", () => {
    expect(median([])).toBeNull();
  });
  test("test array", () => {
    expect(median([2, 999, 50, 100])).toBe(100);
  });
});

describe("test extrinsic", () => {
  const TEST_BLOCK_HEIGHT = 4501546;
  let api, blockHash, block, allEvents;

  beforeAll(async () => {
    api = await getApi();
    blockHash = await api.rpc.chain.getBlockHash(TEST_BLOCK_HEIGHT);
    block = await api.rpc.chain.getBlock(blockHash);
    allEvents = await api.query.system.events.at(blockHash);
  },);

  test("test is extrinsic success", () => {
    expect(isExtrinsicSuccess(allEvents)).toBeTruthy();
  });

  test("test get extrinsic signer", () => {
    expect(getExtrinsicSigner(block.block.extrinsics[0])).toBe("CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp");
  });

  test("test extract extrinsic events", () => {
    expect(extractExtrinsicEvents(allEvents, 0)).toBeTruthy();
  })
});
