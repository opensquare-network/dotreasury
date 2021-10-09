const { updateBounty } = require("../../../mongo/service/bounty");
const { findCallInSections } = require("../../../utils/targetCall");
const { getRealCaller } = require("../../../utils/call");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  Modules,
  TimelineItemTypes,
  BountyMethods,
} = require("../../common/constants");
const { hexToString } = require("@polkadot/util");

async function handleBountyExtended(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(bountyIndex, indexer);
  const caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());

  const call = findCallInSections(
    extrinsic.method,
    [Modules.Treasury, Modules.Bounties],
    BountyMethods.extendBountyExpiry
  );

  if (!call) {
    throw new Error(
      `can not find target ${BountyMethods.extendBountyExpiry} call`
    );
  }

  const { _remark: remark } = call.toJSON().args;
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      remark: hexToString(remark),
    },
    eventData,
    indexer,
  };

  await updateBounty(bountyIndex, { meta, }, timelineItem);
}

module.exports = {
  handleBountyExtended,
}
