const { updateChildBounty } = require("../../../mongo/service/childBounty");
const {
  ChildBountyState,
  ChildBountiesEvents,
  TimelineItemTypes,
} = require("../../common/constants");

async function handleClaimed(event, indexer) {
  const data = event.data.toJSON();
  const [, childBountyId, payout, beneficiary] = data;

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: ChildBountiesEvents.Canceled,
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

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleClaimed,
}
