const { timelineItemTypes } = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const { BountyMethods, Modules } = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");
const { getRealCaller, findTargetCall } = require("../../utils");
import { hexToString } from "@polkadot/util";

async function handleBountyExtended(event, normalizedExtrinsic, extrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const caller = getRealCaller(extrinsic.method, normalizedExtrinsic.signer);
  let call = findTargetCall(
    extrinsic.method,
    Modules.Treasury,
    BountyMethods.extendBountyExpiry
  );
  if (!call) {
    call = findTargetCall(
      extrinsic.method,
      Modules.Bounties,
      BountyMethods.extendBountyExpiry
    );
  }

  if (!call) {
    throw new Error(
      `can not find target ${BountyMethods.extendBountyExpiry} call`
    );
  }

  const { _remark: remark } = call.toJSON().args;
  const args = {
    caller,
    remark: hexToString(remark),
  };

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: event.method,
    args,
    eventData,
    extrinsicIndexer: indexer,
  };

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex },
    {
      $set: { meta },
      $push: { timeline: timelineItem },
    }
  );
}

module.exports = {
  handleBountyExtended,
};
