const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");

async function handleBountyClaimed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, balance, beneficiary] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      beneficiary,
      balance,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Claimed,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyClaimed,
}
