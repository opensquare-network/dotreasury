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

async function handleBountyExtended(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  let args = {};
  if (extrinsic) {
    const caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());
    args = { caller };

    let call;
    try {
      call = findCallInSections(
        extrinsic.method,
        [Modules.Treasury, Modules.Bounties],
        BountyMethods.extendBountyExpiry
      );
    } catch (e) {
      // todo: find reasons and handle them
    }

    args = { caller };
    if (call) {
      const remarkHex = call.args[1].toHex();
      Object.assign(args, { remark: hexToString(remarkHex) });
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args,
    eventData,
    indexer,
  };

  await updateBounty(bountyIndex, { meta, }, timelineItem);
}

module.exports = {
  handleBountyExtended,
}
