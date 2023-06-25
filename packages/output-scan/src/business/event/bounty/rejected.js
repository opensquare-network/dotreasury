const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const { updateBounty } = require("../../../mongo/service/bounty");
const { getRealCaller } = require("../../../utils/call");
const {
  consts: {
    TimelineItemTypes,
    BountyStatus,
  }
} = require("@osn/scan-common");

async function handleBountyRejected(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [bountyIndex, slashed] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);
  let caller;
  if (extrinsic) {
    caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());
  }
  let args = { slashed };
  if (caller) {
    args = {
      caller,
      ...args,
    }
  }
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args,
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
