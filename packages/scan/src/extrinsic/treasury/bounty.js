const {
  BountyMethods,
  Modules,
  ksmTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");
const { getBountyCollection } = require("../../mongo");

function isBountyModule(section, height) {
  if (height < ksmTreasuryRefactorApplyHeight && section === Modules.Treasury) {
    return true;
  }

  return (
    height >= ksmTreasuryRefactorApplyHeight && section === Modules.Bounties
  );
}

async function handleBountyAcceptCurator(normalizedExtrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  if (
    !isBountyModule(section, indexer.blockHeight) ||
    BountyMethods.acceptCurator !== name
  ) {
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
