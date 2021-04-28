const { normalizeExtrinsic } = require("../extrinsic/index");
const { handleTipEvent } = require("./treasury/tip");
const { handleProposalEvent } = require("./treasury/proposal");
const { handleBurntEvent } = require("./treasury/burnt");
const { handleCouncilEvent } = require("./council/index");
const {
  handleBountyEventWithExtrinsic,
  handleBountyBecameActiveEvent,
} = require("./treasury/bounty");
const { handleTreasuryTransferOut } = require("./outTransfer")

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return false;
  }

  let hasTargetEvents = false;
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let normalizedExtrinsic;
    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];
      normalizedExtrinsic = {
        extrinsicIndexer: { ...blockIndexer, index: phaseValue },
        ...normalizeExtrinsic(extrinsic, events),
      };

      const hasTipEvents = await handleTipEvent(
        event,
        normalizedExtrinsic,
        blockIndexer,
        extrinsic
      );
      const hasCouncilEvents = await handleCouncilEvent(
        event,
        normalizedExtrinsic,
        extrinsic
      );
      const hasBountyEvents = await handleBountyEventWithExtrinsic(
        event,
        normalizedExtrinsic,
        extrinsic
      );
      const hasTransferOut = await handleTreasuryTransferOut(event, sort, normalizedExtrinsic)

      if (hasTipEvents || hasCouncilEvents || hasBountyEvents || hasTransferOut) {
        hasTargetEvents = true;
      }
    } else {
      const eventIndexer = { ...blockIndexer, sort };
      const hasBountyEvents = await handleBountyBecameActiveEvent(
        event,
        eventIndexer
      );
      const hasBurntEvents = await handleBurntEvent(event, eventIndexer);
      if (hasBountyEvents || hasBurntEvents) {
        hasTargetEvents = true;
      }
    }

    const hasProposalEvents = await handleProposalEvent(
      event,
      blockIndexer,
      normalizedExtrinsic,
      sort
    );

    if (hasProposalEvents) {
      hasTargetEvents = true
    }
  }

  return hasTargetEvents;
}

module.exports = {
  handleEvents,
};
