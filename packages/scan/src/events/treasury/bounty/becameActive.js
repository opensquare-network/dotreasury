const { Modules, BountyEvents } = require("../../../utils/constants");
const { timelineItemTypes } = require("../../../utils/constants");
const { getBountyMeta } = require("../../../utils/bounty");
const { updateBountyInDb } = require("./common");

function isBountyBecameActiveEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    method === BountyEvents.BountyBecameActive
  );
}

async function handleBountyBecameActiveEvent(event, eventIndexer) {
  const { section, method } = event;
  if (!isBountyBecameActiveEvent(section, method)) {
    return;
  }

  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const meta = await getBountyMeta(eventIndexer.blockHash, bountyIndex);

  const timelineItem = {
    type: timelineItemTypes.event,
    name: method,
    args: {
      bountyIndex,
    },
    eventData,
    eventIndexer,
  };

  await updateBountyInDb(bountyIndex, {
    $set: { meta, state: timelineItem },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleBountyBecameActiveEvent,
};
