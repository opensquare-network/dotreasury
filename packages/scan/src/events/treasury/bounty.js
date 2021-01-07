const {
  Modules,
  BountyEvents,
  BountyMethods,
} = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const { getApi } = require("../../api");

function isBountyEvent(method) {
  return BountyEvents.hasOwnProperty(method);
}

// const isStateChange = isBountyEvent;

async function handleBountyEventWithExtrinsic(
  event,
  normalizedExtrinsic,
  extrinsic
) {
  const { section, method } = event;
  if (Modules.Treasury !== section || !isBountyEvent(method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    await handleProposedEvent(event, normalizedExtrinsic);
  }
}

async function getBountyMeta(blockHash, bountyIndex) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(blockHash, bountyIndex);
  return meta.toJSON();
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
