const { getBountyMeta } = require("./bounty/utils");
const { timelineItemTypes } = require("../../utils/constants");
const { BountyMethods, Modules } = require("../../utils/constants");
const { getRealCaller, findCallInSections } = require("../../utils");
const { hexToString } = require("@polkadot/util");
const { updateBountyInDb } = require("./bounty/common");
const { getApi } = require("../../api");

async function handleBountyExtended(event, normalizedExtrinsic, extrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const api = await getApi();
  const meta = await getBountyMeta(api, indexer.blockHash, bountyIndex);

  const caller = getRealCaller(extrinsic.method, normalizedExtrinsic.signer);
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
    type: timelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      remark: hexToString(remark),
    },
    eventData,
    extrinsicIndexer: indexer,
  };

  await updateBountyInDb(bountyIndex, {
    $set: { meta },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleBountyExtended,
};
