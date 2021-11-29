jest.mock("./chain");

const { tryCreateStatPoint } = require(".");
const { getWeeklyStatsCollection, close } = require("../mongo");

describe("Stats Test", () => {
  const originalEnv = process.env;

  beforeAll(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      MONGO_URL: "mongodb://localhost:27017",
      MONGO_DB_NAME: "dotreasury-output-ksm-test",
    };
  });

  afterAll(async () => {
    await close();
    process.env = originalEnv;
  });

  test("Add stat point", async () => {
    await tryCreateStatPoint({
      blockHeight: 7349037,
      blockHash: "0x334f49cd193b01644c3db061d6445c6d64a54adb28942936a91657bb46a56c3b",
      blockTime: Date.now(),
    });

    const weeklyCol = await getWeeklyStatsCollection();
    const item = await weeklyCol.findOne();
    expect(item).toMatchObject({
      indexer: {
          blockHeight: 1,
          blockHash: "0x334f49cd193b01644c3db061d6445c6d64a54adb28942936a91657bb46aaaaaa",
      },
      output: {
          proposal: 0,
          tip: 0,
          bounty: 0,
          burnt: 0
      }
    });
  })
});
