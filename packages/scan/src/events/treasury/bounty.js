const {
  Modules,
  BountyEvents,
  BountyMethods,
} = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const { getBountyMeta } = require("../../utils/bounty");

function isBountyEvent(method) {
  return BountyEvents.hasOwnProperty(method);
}

// const isStateChange = isBountyEvent;

async function handleBountyEventWithExtrinsic(event, normalizedExtrinsic) {
  const { section, method } = event;
  if (Modules.Treasury !== section || !isBountyEvent(method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    await handleProposedEvent(event, normalizedExtrinsic);
  } else if (
    [
      BountyEvents.BountyAwarded,
      BountyEvents.BountyCanceled,
      BountyEvents.BountyClaimed,
      BountyEvents.BountyExtended,
      BountyEvents.BountyRejected,
    ].includes(method)
  ) {
    await handleBountyStateUpdateEvent(event, normalizedExtrinsic);
  }
}

async function handleBountyStateUpdateEvent(event, normalizedExtrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

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

async function handleBountyBecameActiveEvent(event, eventIndexer) {
  const { section, method } = event;
  if (
    Modules.Treasury !== section ||
    method !== BountyEvents.BountyBecameActive
  ) {
    return;
  }

  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];
  const meta = await getBountyMeta(eventIndexer.blockHash, bountyIndex);

  const timelineItem = {
    name: method,
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

async function handleProposedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const timeline = [
    {
      name: BountyMethods.proposeBounty,
      eventData,
      extrinsic: normalizedExtrinsic,
    },
  ];

  const bountyCol = await getBountyCollection();
  await bountyCol.insertOne({
    indexer,
    bountyIndex,
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
