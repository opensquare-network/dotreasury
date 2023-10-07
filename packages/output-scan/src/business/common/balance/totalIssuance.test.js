const { getTotalIssuance } = require("./totalIssuance");
const {
  chain: {
    getApi,
  },
  test: { setPolkadot, disconnect }
} = require("@osn/scan-common");
jest.setTimeout(3000000);

test("Getting total issuance works", async () => {
  await setPolkadot();

  const api = await getApi();
  const height = 10886400;
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const issuance = await getTotalIssuance(blockHash);
  expect(issuance).toEqual("12060853700498460592");

  await disconnect();
})
