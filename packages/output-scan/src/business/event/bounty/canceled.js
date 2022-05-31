const { updateBounty } = require("../../../mongo/service/bounty");
const { getRealCaller } = require("../../../utils/call");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  consts: {
    TimelineItemTypes,
    BountyStatus,
  }
} = require("@osn/scan-common");

async function handleBountyCanceled(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);
  const caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Canceled,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyCanceled,
}
