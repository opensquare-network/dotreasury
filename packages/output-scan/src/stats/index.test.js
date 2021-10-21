const dotenv = require("dotenv");
dotenv.config();

jest.mock("./chain");

const { tryCreateStatPoint } = require(".");
const { getWeeklyStatsCollection } = require("../mongo");

describe("Stats Test", () => {
  beforeAll(async () => {
  });

  afterAll(async () => {
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
          blockHeight: 100800,
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
