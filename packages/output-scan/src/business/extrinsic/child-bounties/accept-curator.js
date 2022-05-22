const { updateChildBounty } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");
const {
  Modules,
  ChildBountiesMethods,
  ChildBountyState,
  TimelineItemTypes,
} = require("../../common/constants");

async function handleAcceptCurator(call, author, indexer) {
  if (
    ![Modules.ChildBounties].includes(call.section) ||
    ChildBountiesMethods.acceptCurator !== call.method
  ) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();
  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);

  const {
    status: {
      active: { curator } = {}
    } = {}
  } = meta || {};

  const updates = {
    meta,
    curator,
    state: {
      indexer,
      state: ChildBountyState.Active,
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: ChildBountiesMethods.acceptCurator,
    args: { curator, },
    indexer,
  };

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleAcceptCurator,
}
