jest.setTimeout(30000);

const { getBountyMeta, getBountyDescription } = require("../../utils/bounty");

describe("test utils bounty", () => {
  const TEST_BOUNTY_BLOCK_HASH =
    "0x6a258eedadb6ddeee7bf5e930ef6a3f859e9339d5dbe09405271e64375e9a726";
  const TEST_BOUNTY_INDEX = 0;

  test("get bounty meta", async () => {
    expect(
      await getBountyMeta(TEST_BOUNTY_BLOCK_HASH, TEST_BOUNTY_INDEX)
    ).toEqual({
      proposer: "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      value: 1165000000000000,
      fee: 0,
      curatorDeposit: 0,
      bond: 206666666650,
      status: { proposed: null },
    });
  });

  test("get bounty description", async () => {
    expect(
      await getBountyDescription(TEST_BOUNTY_BLOCK_HASH, TEST_BOUNTY_INDEX)
    ).toBe("Kusama network UI Bounty");
  });
});
