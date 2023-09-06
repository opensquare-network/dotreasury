const { updateChildBounty } = require("../../../mongo/service/childBounty");
const {
  consts: {
    ChildBountyState,
    ChildBountiesEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleCanceled(event, indexer) {
  const data = event.data.toJSON();
  const [, childBountyId] = data;

  const state = {
    indexer,
    state: ChildBountyState.Canceled,
  }

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: ChildBountiesEvents.Canceled,
    args: {},
    indexer,
  };

  await updateChildBounty(childBountyId, {
    state,
    isFinal: true,
  }, timelineItem);
}

module.exports = {
  handleCanceled,
}
