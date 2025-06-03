const { updateChildBountyWithParentId } = require("../../../mongo/service/childBounty");
const {
  consts: {
    ChildBountyState,
    ChildBountiesEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleClaimed(event, indexer) {
  const data = event.data.toJSON();
  const [parentBountyId, childBountyId, payout, beneficiary] = data;

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: ChildBountiesEvents.Claimed,
    args: {
      payout,
      beneficiary,
    },
    indexer,
  };

  const updates = {
    beneficiary,
    state: {
      indexer,
      state: ChildBountyState.Claimed,
    },
    isFinal: true,
  }

  await updateChildBountyWithParentId(parentBountyId, childBountyId, updates, timelineItem);
}

module.exports = {
  handleClaimed,
}
