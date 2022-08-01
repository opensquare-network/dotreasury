const { updateBounty } = require("../../../mongo/service/bounty");
const { findCallInSections } = require("../../../utils/targetCall");
const { getRealCaller } = require("../../../utils/call");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  consts: {
    Modules,
    TimelineItemTypes,
    BountyMethods,
  }
} = require("@osn/scan-common");
const { hexToString } = require("@polkadot/util");

async function handleBountyExtended(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
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

  const remarkHex = call.args[1].toHex();
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      remark: hexToString(remarkHex),
    },
    eventData,
    indexer,
  };

  await updateBounty(bountyIndex, { meta, }, timelineItem);
}

module.exports = {
  handleBountyExtended,
}
