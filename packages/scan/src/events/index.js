const { normalizeExtrinsic } = require("../extrinsic/index");
const { handleTipEvent } = require("./treasury/tip");
const { handleProposalEvent } = require("./treasury/proposal/index");
const { handleBurntEvent } = require("./treasury/burnt");
const { handleCouncilEvent } = require("./council/index");
const { handleBountyEventWithExtrinsic } = require("./treasury/bounty");
const {
  handleBountyBecameActiveEvent,
} = require("./treasury/bounty/becameActive");
const { handleTreasuryTransferOut } = require("./outTransfer");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return false;
  }

  const normalizedExtrinsics = extrinsics.map((extrinsic) =>
    normalizeExtrinsic(extrinsic, events)
  );

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let normalizedExtrinsic;
    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];
      const normalized = normalizedExtrinsics[phaseValue];
      normalizedExtrinsic = {
        extrinsicIndexer: { ...blockIndexer, index: phaseValue },
        ...normalized,
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
