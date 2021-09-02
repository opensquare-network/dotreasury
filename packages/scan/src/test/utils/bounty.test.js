jest.setTimeout(30000);

const { getBountyDescription } = require("../../utils/bounty");

describe("test utils bounty", () => {
  const TEST_BOUNTY_BLOCK_HASH =
    "0x6a258eedadb6ddeee7bf5e930ef6a3f859e9339d5dbe09405271e64375e9a726";
  const TEST_BOUNTY_INDEX = 0;

  test("get bounty description", async () => {
    expect(
      await getBountyDescription(TEST_BOUNTY_BLOCK_HASH, TEST_BOUNTY_INDEX)
    ).toBe("Kusama network UI Bounty");
  });
});
