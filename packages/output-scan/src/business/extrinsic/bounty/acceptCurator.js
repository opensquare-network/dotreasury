const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  Modules,
  BountyMethods,
  TimelineItemTypes,
} = require("../../common/constants");

async function handleAcceptCurator(call, caller, extrinsicIndexer) {
  if (
    ![Modules.Treasury, Modules.Bounties].includes(call.section) ||
    BountyMethods.acceptCurator !== call.method
  ) {
    return;
  }

  const { bounty_id: bountyIndex } = call.toJSON().args;
  const meta = await getBountyMeta(extrinsicIndexer.blockHash, bountyIndex);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: call.method,
    args: {
      caller,
    },
    indexer: extrinsicIndexer,
  };

  await updateBounty(bountyIndex, { meta, }, timelineItem);
}

module.exports = {
  handleAcceptCurator,
}
