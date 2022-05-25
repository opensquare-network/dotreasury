const { getTreasuryBalance } = require("./freeBalance");
const {
  chain:
    {
      setSpecHeights,
      setApi, setProvider,
    },
  consts: { CHAINS },
  env: { setChain, }
} = require("@osn/scan-common");
const { ApiPromise, WsProvider } = require("@polkadot/api");

jest.setTimeout(3000000);

async function testTreasuryBalance(api, height, targetBalance) {
  const blockHeight = height;
  await setSpecHeights([blockHeight]);
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const balance = await getTreasuryBalance(blockHash);
  expect(balance).toBe(targetBalance);
}

describe("Getting balance of", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setProvider(provider);
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("kusama works", async () => {
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
