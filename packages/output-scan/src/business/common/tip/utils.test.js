const { getTippersCountFromApi, getTipFindersFeeFromApi } = require("./utils");
const {
  chain: {
    getApi,
  },
  test: { disconnect, setKusama }
} = require("@osn/scan-common");
jest.setTimeout(3000000);

async function testTippersCount(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const tipperCount = await getTippersCountFromApi(blockHash);

  expect(tipperCount).toEqual(target);
}

async function testGetTipFindersFee(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const fee = await getTipFindersFeeFromApi(blockHash);

  expect(fee).toEqual(target);
}

describe("test tip utils", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("getTippersCount works", async () => {
    const api = await getApi();
    const data = [
      [12345, 13],
      [9623456, 19]
    ]

    for (const item of data) {
      await testTippersCount(api, item[0], item[1]);
    }
  })

  test("getTipFindersFeeFromApi works", async () => {
    const api = await getApi();
    const data = [
      [323456, null],
      [602672, 20],
      [9623456, 20]
    ]

    for (const item of data) {
      await testGetTipFindersFee(api, item[0], item[1]);
    }
  })
})
