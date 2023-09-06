/**
 * @jest-environment node
 */

const { tryCreateStatPoint } = require(".");
const { getWeeklyStatsCollection } = require("../mongo/data");
const { updateScanStatus } = require("../mongo/scanHeight");

jest.mock("../utils/freeBalance");

xdescribe("Stats Test", () => {
  beforeAll(async () => {
    await updateScanStatus(100800, {});
  });

  afterAll(async () => {
  });

  test("Add stat point", async () => {
    await tryCreateStatPoint({
      blockHeight: 100800,
      blockHash: "0x334f49cd193b01644c3db061d6445c6d64a54adb28942936a91657bb46a56c3b",
      blockTime: Date.now(),
    });

    const weeklyCol = await getWeeklyStatsCollection();
    const item = await weeklyCol.findOne();
    expect(item).toMatchObject({
      indexer: {
          blockHeight: 100800,
          blockHash: "0x334f49cd193b01644c3db061d6445c6d64a54adb28942936a91657bb46a56c3b",
      },
      treasuryBalance: "1000000000000",
      income: {},
    });
  })
});
