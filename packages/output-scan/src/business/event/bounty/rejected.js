const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const { updateBounty } = require("../../../mongo/service/bounty");
const { getRealCaller } = require("../../../utils/call");
const {
  consts: {
    TimelineItemTypes,
    BountyStatus,
  }
} = require("@osn/scan-common");

async function handleBountyRejected(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, slashed] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);
  const caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      slashed,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Rejected,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyRejected,
}
