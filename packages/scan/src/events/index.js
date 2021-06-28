const { normalizeExtrinsic } = require("../extrinsic/index");
const { handleTipEvent } = require("./treasury/tip");
const { handleProposalEvent } = require("./treasury/proposal");
const { handleBurntEvent } = require("./treasury/burnt");
const { handleCouncilEvent } = require("./council/index");
const {
  handleBountyEventWithExtrinsic,
  handleBountyBecameActiveEvent,
} = require("./treasury/bounty");
const { handleTreasuryTransferOut } = require("./outTransfer");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return false;
  }

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

      await handleTipEvent(event, normalizedExtrinsic, blockIndexer, extrinsic);
      await handleCouncilEvent(event, normalizedExtrinsic, extrinsic);
      await handleBountyEventWithExtrinsic(
        event,
        normalizedExtrinsic,
        extrinsic
      );
      await handleTreasuryTransferOut(event, sort, normalizedExtrinsic);
    } else {
      const eventIndexer = { ...blockIndexer, sort };
      await handleBountyBecameActiveEvent(event, eventIndexer);
      await handleBurntEvent(event, eventIndexer);
    }

    await handleProposalEvent(event, blockIndexer, normalizedExtrinsic, sort);
  }
}

module.exports = {
  handleEvents,
};
