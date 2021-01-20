const { BountyMethods, Modules } = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");
const { getBountyCollection } = require("../../mongo");

async function handleBountyAcceptCurator(normalizedExtrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (section !== Modules.Treasury || BountyMethods.acceptCurator !== name) {
    return false;
  }

  const { bounty_id: bountyIndex } = args;
  const meta = await getBountyMeta(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    bountyIndex
  );

  const timelineItem = {
    name,
    extrinsic: normalizedExtrinsic,
  };

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex },
    {
      $set: { meta },
      $push: { timeline: timelineItem },
    }
  );

  return true;
}

module.exports = {
  handleBountyAcceptCurator,
};
