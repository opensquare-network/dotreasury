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
  blockIndexer,
  phase,
  event,
  eventSort,
) {
  const indexer = {
    ...blockIndexer,
    extrinsicIndex: phase.isNull ? undefined : phase.value.toNumber(),
    eventIndex: eventSort,
  };

  await handleTreasuryTransferOut(event, indexer);
  await handleBurntEvent(event, indexer);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    await handleCommon(blockIndexer, phase, event, sort);

    if (phase.isNull) {
      await handleEventWithoutExtrinsic(blockIndexer, event, sort, events);
      continue;
    }

    const extrinsicIndex = phase.value.toNumber();
    const extrinsic = extrinsics[extrinsicIndex];
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
