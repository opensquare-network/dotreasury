const { handlePreimageEvent } = require("./preimage");
const { handleTipEventWithoutExtrinsic } = require("./tip");
const { handleSchedulerEvents } = require("./scheduler");
const { handleReferendaEvent } = require("./referenda");
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
const { handleRollover } = require("./period")
const { handleReferendaDelegation } = require("./convictionVoting");
const { handleTransferOutWithoutExtrinsic } = require("./transfer/outWithoutExtrinsic");

async function handleEventWithExtrinsic(indexer, event, extrinsic, blockEvents) {
  await handleTipEvent(event, extrinsic, indexer);
  await handleTreasuryProposalEvent(event, extrinsic, indexer);
  await handleMotionEvent(event, extrinsic, indexer, blockEvents);
  await handleBountyEventWithExtrinsic(event, extrinsic, indexer);

  await handleTreasuryTransferOut(event, indexer, extrinsic);
}

async function handleEventWithoutExtrinsic(indexer, event, blockEvents) {
  await handleTreasuryProposalEventWithoutExtrinsic(event, indexer);
  await handleBountyEventWithoutExtrinsic(event, indexer);
  await handleTipEventWithoutExtrinsic(event, indexer);
  await handleTransferOutWithoutExtrinsic(event, indexer);

  await handleRollover(event, indexer);
}

async function handleCommon(
  event,
  indexer,
  extrinsic,
  blockEvents,
) {
  await handleBurntEvent(event, indexer, extrinsic);
  await handleChildBountiesEvents(event, indexer, extrinsic, blockEvents);
  await handleReferendumEvent(...arguments);
  await handleReferendaEvent(event, indexer, extrinsic, blockEvents);
  await handleSchedulerEvents(event, indexer, extrinsic, blockEvents);
  await handlePreimageEvent(event, indexer, extrinsic, blockEvents);
  await handleReferendaDelegation(event, indexer, extrinsic, blockEvents);
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

    await handleCommon(event, indexer, extrinsic, events);

    if (phase.isNone) {
      await handleEventWithoutExtrinsic(indexer, event, events);
    } else {
      await handleEventWithExtrinsic(indexer, event, extrinsic, events);
    }
  }
}

module.exports = {
  handleCommonEvents: handleCommon,
  handleEvents,
  handleEventWithoutExtrinsic,
  handleEventWithExtrinsic,
};
