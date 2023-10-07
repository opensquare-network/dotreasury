const { getBurnPercent } = require("./burnPercent");
const {
  chain: {
    getApi,
  },
  test: { disconnect, setKusama }
} = require("@osn/scan-common");

jest.setTimeout(3000000);

async function testBurnPercent(api, height, targetBurn) {
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const burnPercent = await getBurnPercent(blockHash);
  expect(burnPercent).toBe(targetBurn);
}

describe("Getting burn percent", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const api = await getApi();
    await testBurnPercent(api, 1123200, "0.00%");
    await testBurnPercent(api, 9504000, "0.20%");
  })
})
