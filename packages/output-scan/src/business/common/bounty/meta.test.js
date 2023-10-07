const { getBountyDescription } = require("./description");
const { getBountyMeta } = require("./meta");
const {
  chain: {
    getApi,
    setSpecHeights,
  },
  test: { disconnect, setKusama }
} = require("@osn/scan-common");
jest.setTimeout(3000000);

async function testBountyData(api, height, bountyIndex, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getBountyMeta(blockHash, bountyIndex);
  expect(meta).toEqual(toTestMeta);
}

async function testBountyDescription(api, height, bountyIndex, target) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const description = await getBountyDescription(blockHash, bountyIndex)
  expect(description).toBe(target)
}

describe("test get treasury bounty", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("meta works", async () => {
    const api = await getApi();
    await testBountyData(api, 6006977, 1, {
      "proposer": "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      "value": 1530000000000000,
      "fee": 0,
      "curatorDeposit": 0,
      "bond": 214999999980,
      "status": {
        "proposed": null
      }
    })

    await testBountyData(api, 4501546, 0, {
      "proposer": "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      "value": 1165000000000000,
      "fee": 0,
      "curatorDeposit": 0,
      "bond": 206666666650,
      "status": {
        "proposed": null
      }
    })

    await testBountyData(api, 6219001, 0, {
      "proposer": "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      "value": 1165000000000000,
      "fee": 1000000000000,
      "curatorDeposit": 500000000000,
      "bond": 206666666650,
      "status": {
        "pendingPayout": {
          "curator": "J9nD3s7zssCX7bion1xctAF6xcVexcpy2uwy4jTm9JL8yuK",
          "beneficiary": "F37HGobEx1N9YVbQmz1Nsgr2MFifazqn4TskjKatAByNdkJ",
          "unlockAt": 6218770
        }
      }
    })

    await testBountyData(api, 9369951, 7, {
      "proposer": "DdtBope22Y8q53iPNBj5wGVaRzrSKHrZA4bGSWJHCxe8bmL",
      "value": 1000000000000,
      "fee": 0,
      "curatorDeposit": 0,
      "bond": 3366666633,
      "status": {
        "proposed": null
      }
    })
  });

  test("description works", async () => {
    const api = await getApi();
    await testBountyDescription(api, 4501546, 0, "Kusama network UI Bounty");
    await testBountyDescription(api, 9369951, 7, "1");
  })
});
