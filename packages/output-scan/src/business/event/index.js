const { handleReferendumEvent } = require("./democracy/referendum");
const { handleChildBountiesEvents } = require("./child-bounties");
const { handleBurntEvent } = require("./burnt");
const { handleTreasuryTransferOut } = require("./outTransfer");
const { handleMotionEvent } = require("./motion");
const { handleTreasuryProposalEventWithoutExtrinsic } = require("./proposal");
const { handleTreasuryProposalEvent } = require("./proposal");
const { handleTipEvent } = require("./tip");
const {
  handleBountyEventWithExtrinsic,
  handleBountyEventWithoutExtrinsic,
} = require("./bounty")

async function handleEventWithExtrinsic(
  blockIndexer,
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  blockEvents
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
    extrinsicIndex,
  };

  await handleTipEvent(event, extrinsic, indexer);
  await handleTreasuryProposalEvent(event, extrinsic, indexer);
  await handleMotionEvent(event, extrinsic, indexer, blockEvents);
  await handleBountyEventWithExtrinsic(event, extrinsic, indexer);

  await handleTreasuryTransferOut(event, indexer, extrinsic);
}

async function handleEventWithoutExtrinsic(
  blockIndexer,
  event,
  eventSort,
  blockEvents
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  await handleTreasuryProposalEventWithoutExtrinsic(event, indexer);
  await handleBountyEventWithoutExtrinsic(event, indexer);
}

async function handleCommon(
  event,
  indexer,
  extrinsic
) {
  await handleBurntEvent(event, indexer, extrinsic);
  await handleChildBountiesEvents(event, indexer, extrinsic);
  await handleReferendumEvent(...arguments);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    }

    let extrinsic, extrinsicIndex;
    if (!phase.isNone) {
      extrinsicIndex = phase.value.toNumber();
      indexer = { ...indexer, extrinsicIndex };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleCommon(event, indexer, extrinsic);

    if (phase.isNone) {
      await handleEventWithoutExtrinsic(blockIndexer, event, sort, events);
      continue;
    }

    await handleEventWithExtrinsic(
      blockIndexer,
      event,
      sort,
      extrinsic,
      extrinsicIndex,
      events
    );
  }
}

module.exports = {
  handleEvents,
};
