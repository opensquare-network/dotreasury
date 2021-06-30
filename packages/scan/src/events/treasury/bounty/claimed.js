const { timelineItemTypes } = require("../../../utils/constants");
const { getBountyMetaByBlockHeight } = require("../../../utils/bounty");
const { updateBountyInDb } = require("./common");

async function handleBountyClaimed(event, normalizedExtrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  const eventData = event.data.toJSON();
  const [bountyIndex, balance, beneficiary] = eventData;
  const meta = await getBountyMetaByBlockHeight(
    indexer.blockHeight - 1,
    bountyIndex
  );

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: event.method,
    args: {
      beneficiary,
      balance,
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
  handleBountyClaimed,
};
