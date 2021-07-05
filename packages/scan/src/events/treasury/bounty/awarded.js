const { timelineItemTypes } = require("../../../utils/constants");
const { getBountyMeta } = require("../../../utils/bounty");
const { updateBountyInDb } = require("./common");

async function handleBountyAwarded(event, normalizedExtrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  const eventData = event.data.toJSON();
  const [bountyIndex, beneficiary] = eventData;
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: event.method,
    args: {
      beneficiary,
    },
    eventData,
    extrinsicIndexer: indexer,
  };

  await updateBountyInDb(bountyIndex, {
    $set: { meta, state: timelineItem },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleBountyAwarded,
};
