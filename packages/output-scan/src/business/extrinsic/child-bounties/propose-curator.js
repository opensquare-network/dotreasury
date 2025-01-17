const { updateChildBounty, updateChildBountyTimeline } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");
const {
  consts: {
    Modules,
    ChildBountiesMethods,
    ChildBountyState,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");
const { isChildBountyFinished } = require("./common");
const { getHeightBlockEvents } = require("../../../store");

async function handleProposeCurator(call, author, indexer) {
  if (
    ![Modules.ChildBounties].includes(call.section) ||
    ChildBountiesMethods.proposeCurator !== call.method
  ) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();
  const curator = call.args[2].toString();
  const fee = call.args[3].toNumber();

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: ChildBountiesMethods.proposeCurator,
    args: {
      curator,
      fee,
    },
    indexer,
  };

  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);
  const blockEvents = getHeightBlockEvents(indexer.blockHeight);
  if (!meta && isChildBountyFinished(childBountyId, blockEvents)) {
    await updateChildBountyTimeline(childBountyId, timelineItem);
    return;
  }

  const updates = {
    fee,
    state: {
      indexer,
      state: ChildBountyState.CuratorProposed,
    }
  };
  if (meta) {
    Object.assign(updates, { meta });
  }

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleProposeCurator,
}
