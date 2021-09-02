const { getBountyMeta } = require("../../../events/treasury/bounty/utils");
const { isBountyModule } = require("../../../utils/bounty");
const {
  BountyMethods,
  timelineItemTypes,
} = require("../../../utils/constants");
const { updateBountyInDb } = require("../../../events/treasury/bounty/common");
const { getApi } = require("../../../api");

async function handleAcceptCurator(call, caller, extrinsicIndexer) {
  if (
    !isBountyModule(call.section) ||
    BountyMethods.acceptCurator !== call.method
  ) {
    return;
  }

  const { bounty_id: bountyIndex } = call.toJSON().args;
  const api = await getApi();
  const meta = await getBountyMeta(
    api,
    extrinsicIndexer.blockHash,
    bountyIndex
  );

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: call.method,
    args: {
      caller,
    },
    extrinsicIndexer,
  };

  await updateBountyInDb(bountyIndex, {
    $set: { meta, state: timelineItem },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleAcceptCurator,
};
