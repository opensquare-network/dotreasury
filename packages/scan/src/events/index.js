const { normalizeExtrinsic } = require("../extrinsic/index");
const { handleTipEvent } = require("./treasury/tip");
const { handleProposalEvent } = require("./treasury/proposal");
const { handleCouncilEvent } = require("./council/index");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
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

      // await handleTipEvent(event, normalizedExtrinsic, blockIndexer);
      await handleCouncilEvent(event, normalizedExtrinsic);
    }

    // await handleProposalEvent(event, blockIndexer, normalizedExtrinsic);
  }
}

module.exports = {
  handleEvents,
};
