const { setSpecHeights } = require("../../../chain/specs");
const { setApi, setProvider } = require("@dotreasury/common");
jest.setTimeout(3000000);

const { getTreasuryProposalMeta } = require("./meta");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function testProposalData(api, height, proposalIndex, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getTreasuryProposalMeta(blockHash, proposalIndex);
  expect(meta).toEqual(toTestMeta);
}

describe("test get treasury proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/kusama", 1000);
    api = await ApiPromise.create({ provider });
    setProvider(provider)
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("meta works", async () => {
    await testProposalData(api, 126165, 0, {
      "proposer": "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y",
      "value": 50000000000000,
      "beneficiary": "EaG2CRhJWPb7qmdcJvy3LiWdh26Jreu9Dx6R1rXxPmYXoDk",
      "bond": 2500000000000
    })

    await testProposalData(api, 9251905, 112, {
      "proposer": "J722g6dAJehj1t37gPk3QynJeJWD2E1JJS3FevvjGwjGuKU",
      "value": 194450000000000,
      "beneficiary": "J722g6dAJehj1t37gPk3QynJeJWD2E1JJS3FevvjGwjGuKU",
      "bond": 9722500000000
    })

  });
});
