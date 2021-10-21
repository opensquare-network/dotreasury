/**
 * @jest-environment node
 */

const { tryCreateStatPoint } = require(".");

jest.mock("../utils/freeBalance");

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
  })
});
