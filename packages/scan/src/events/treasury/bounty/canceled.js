const { timelineItemTypes } = require("../../../utils/constants");
const { getBountyMetaByBlockHeight } = require("../../../utils/bounty");
const { updateBountyInDb } = require("./common");
const { getRealCaller } = require("../../../utils");

async function handleBountyCanceled(event, normalizedExtrinsic, extrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;
  const meta = await getBountyMetaByBlockHeight(
    indexer.blockHeight - 1,
    bountyIndex
  );
  const caller = getRealCaller(extrinsic.method, normalizedExtrinsic.signer);

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
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
  handleBountyCanceled,
};
