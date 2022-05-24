const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  consts: {
    TimelineItemTypes,
    BountyStatus,
  }
} = require("@osn/scan-common")

async function handleBountyAwarded(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, beneficiary] = eventData;

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      beneficiary,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.PendingPayout,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyAwarded,
}
