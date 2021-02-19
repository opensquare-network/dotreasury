jest.setTimeout(30000);

const { getMetadataConstByBlockHash } = require("../../utils/");

describe("test utils bounty", () => {
  const TEST_BLOCK_HASH =
    "0x7cffec4ac944ba0e88b93348f369ebca6d24a7851bec7b7f25edc6c33fe70148"; // height 5348476

  test("get treasury burnt const", async () => {
    const v = await getMetadataConstByBlockHash(
      TEST_BLOCK_HASH,
      "Treasury",
      "Burn"
    );
    expect(v.toHuman()).toEqual("0.20%");
  });

  test("get electionsPhragmen members count", async () => {
    const v = await getMetadataConstByBlockHash(
      TEST_BLOCK_HASH,
      "ElectionsPhragmen",
      "DesiredMembers"
    );
    expect(v.toNumber()).toEqual(19);
  });
});
