const {
  Modules,
  BountyEvents,
  BountyMethods,
  timelineItemTypes,
} = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const {
  getBountyMeta,
  getBountyDescription,
  getBountyMetaByBlockHeight,
} = require("../../utils/bounty");
const { handleBountyExtended } = require("./bountyExtended");
const { getRealCaller, findTargetCall } = require("../../utils");
const { hexToString } = require("@polkadot/util");

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
  } else if (
    [
      BountyEvents.BountyAwarded,
      BountyEvents.BountyCanceled,
      BountyEvents.BountyClaimed,
      BountyEvents.BountyRejected,
    ].includes(method)
  ) {
    await handleBountyStateUpdateEvent(
      event,
      normalizedExtrinsic,
      method === BountyEvents.BountyRejected ||
        [BountyEvents.BountyCanceled, BountyEvents.BountyClaimed].includes(
          method
        )
    );
  }
}

async function handleBountyStateUpdateEvent(
  event,
  normalizedExtrinsic,
  fetchPreBlockMeta = false
) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  let meta;
  if (fetchPreBlockMeta) {
    meta = await getBountyMetaByBlockHeight(
      indexer.blockHeight - 1,
      bountyIndex
    );
  } else {
    meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  }

  const timelineItem = {
    name: event.method,
    eventData,
    extrinsic: normalizedExtrinsic,
  };

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex },
    {
      $set: { meta, state: timelineItem },
      $push: { timeline: timelineItem },
    }
  );
}

function isBountyBecameActiveEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    method === BountyEvents.BountyBecameActive
  );
}

async function handleBountyBecameActiveEvent(event, eventIndexer) {
  const { section, method } = event;
  if (!isBountyBecameActiveEvent(section, method)) {
    return;
  }

  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const meta = await getBountyMeta(eventIndexer.blockHash, bountyIndex);

  const timelineItem = {
    type: timelineItemTypes.event,
    name: method,
    args: {
      bountyIndex,
    },
    eventData,
    eventIndexer,
  };

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex },
    {
      $set: { meta, state: timelineItem },
      $push: { timeline: timelineItem },
    }
  );
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
  handleBountyBecameActiveEvent,
};
