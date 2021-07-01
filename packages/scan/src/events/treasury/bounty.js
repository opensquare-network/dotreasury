const {
  Modules,
  BountyEvents,
  BountyMethods,
  timelineItemTypes,
} = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const { getBountyMeta, getBountyDescription } = require("../../utils/bounty");
const { handleBountyExtended } = require("./bountyExtended");
const { getRealCaller, findTargetCall } = require("../../utils");
const { hexToString } = require("@polkadot/util");
const { handleBountyAwarded } = require("./bounty/awarded");
const { handleBountyRejected } = require("./bounty/rejected");
const { handleBountyClaimed } = require("./bounty/claimed");
const { handleBountyCanceled } = require("./bounty/canceled");

function isBountyEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    BountyEvents.hasOwnProperty(method)
  );
}

async function handleBountyEventWithExtrinsic(
  event,
  normalizedExtrinsic,
  extrinsic
) {
  const { section, method } = event;
  if (!isBountyEvent(section, method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    await handleProposedEvent(event, normalizedExtrinsic, extrinsic);
  } else if (method === BountyEvents.BountyExtended) {
    await handleBountyExtended(event, normalizedExtrinsic, extrinsic);
  } else if (method === BountyEvents.BountyAwarded) {
    await handleBountyAwarded(event, normalizedExtrinsic);
  } else if (method === BountyEvents.BountyRejected) {
    await handleBountyRejected(event, normalizedExtrinsic, extrinsic);
  } else if (method === BountyEvents.BountyClaimed) {
    await handleBountyClaimed(event, normalizedExtrinsic);
  } else if (method === BountyEvents.BountyCanceled) {
    await handleBountyCanceled(event, normalizedExtrinsic, extrinsic);
  }
}

async function handleProposedEvent(event, normalizedExtrinsic, extrinsic) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  const description = await getBountyDescription(
    indexer.blockHash,
    bountyIndex
  );

  const proposer = getRealCaller(extrinsic.method, normalizedExtrinsic.signer);
  let proposeCall = findTargetCall(
    extrinsic.method,
    Modules.Treasury,
    BountyMethods.proposeBounty
  );
  if (!proposeCall) {
    proposeCall = findTargetCall(
      extrinsic.method,
      Modules.Bounties,
      BountyMethods.proposeBounty
    );
  }

  if (!proposeCall) {
    throw new Error("can not find the target proposeBounty extrinsic");
  }

  const { value, description: descriptionInArg } = proposeCall.toJSON().args;
  const args = {
    proposer,
    value,
    description: hexToString(descriptionInArg) || description,
  };

  const timeline = [
    {
      type: timelineItemTypes.extrinsic,
      name: BountyMethods.proposeBounty,
      args,
      eventData,
      extrinsicIndexer: indexer,
    },
  ];

  const bountyCol = await getBountyCollection();
  await bountyCol.insertOne({
    indexer,
    bountyIndex,
    description,
    meta,
    state: {
      name: event.method,
      indexer,
      normalizedExtrinsic,
    },
    timeline,
  });
}

module.exports = {
  handleBountyEventWithExtrinsic,
};
