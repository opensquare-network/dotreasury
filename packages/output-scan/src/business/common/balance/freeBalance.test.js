const { getTreasuryBalance } = require("./freeBalance");
const {
  chain: {
    getApi,
    setSpecHeights,
  },
  test: { disconnect, setKusama }
} = require("@osn/scan-common");

jest.setTimeout(3000000);

async function testTreasuryBalance(api, height, targetBalance) {
  const blockHeight = height;
  await setSpecHeights([blockHeight]);
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const balance = await getTreasuryBalance(blockHash);
  expect(balance).toBe(targetBalance);
}

describe("Getting balance of", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("kusama works", async () => {
    const api = await getApi();
    const testArr = [
      [86400, "20521587906898179"],
      [1468800, "165682945472844815"],
      [9504000, "436502226037825517"],
    ]

    for (const item of testArr) {
      await testTreasuryBalance(api, item[0], item[1])
    }
  })
})
