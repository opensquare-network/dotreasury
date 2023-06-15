const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  consts: {
    BountyStatus,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleBountyBecameActiveEvent(event, indexer) {
  const { method } = event;

  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: method,
    args: {},
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Active,
  }

  await updateBounty(bountyIndex, {
    awardHeight: indexer.blockHeight,
    meta,
    state,
  }, timelineItem);
}

module.exports = {
  handleBountyBecameActiveEvent,
}
