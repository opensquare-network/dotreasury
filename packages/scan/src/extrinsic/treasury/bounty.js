const { BountyMethods, Modules } = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");
const { getBountyCollection } = require("../../mongo");

function isBountyModule(section) {
  return [Modules.Treasury, Modules.Bounties].includes(section);
}

async function handleBountyAcceptCurator(normalizedExtrinsic) {
  // TODO: handle acceptCurator wrapped in batch/multisig extrinsic
  const { section, name, args } = normalizedExtrinsic;
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  if (!isBountyModule(section) || BountyMethods.acceptCurator !== name) {
    return false;
  }

  const { bounty_id: bountyIndex } = args;
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

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
