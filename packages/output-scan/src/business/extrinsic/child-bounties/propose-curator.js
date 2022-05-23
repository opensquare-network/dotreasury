const { updateChildBounty } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");
const {
  Modules,
  ChildBountiesMethods,
  ChildBountyState,
  TimelineItemTypes,
} = require("../../common/constants");

async function handleProposeCurator(call, author, indexer) {
  if (
    ![Modules.ChildBounties].includes(call.section) ||
    ChildBountiesMethods.proposeCurator !== call.method
  ) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();

  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);
  const {
    fee,
    status: {
      curatorProposed: { curator } = {}
    } = {}
  } = meta || {};

  const updates = {
    meta,
    fee,
    curator,
    state: {
      indexer,
      state: ChildBountyState.CuratorProposed,
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: ChildBountiesMethods.proposeCurator,
    args: {
      curator,
      fee,
    },
    indexer,
  };

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleProposeCurator,
}
