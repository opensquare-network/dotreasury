const { updateChildBounty } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");
const {
  consts: {
    ChildBountyState,
    ChildBountiesEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common")

async function handleAwarded(event, indexer) {
  const data = event.data.toJSON();
  const [parentBountyId, childBountyId, beneficiary] = data;
  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);
  const { curator, unlockAt } = meta?.status?.pendingPayout;

  const updates = {
    meta,
    curator,
    beneficiary,
    unlockAt,
    state: {
      indexer,
      state: ChildBountyState.PendingPayout,
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: ChildBountiesEvents.Awarded,
    args: {
      beneficiary,
      unlockAt,
    },
    indexer,
  };

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleAwarded,
}
