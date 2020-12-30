const { extractEventBusinessData } = require("./extractBusiness");
const { normalizeExtrinsic } = require("../extrinsic/index")

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];

      const normalizedExtrinsic = {
        extrinsicIndexer: { ...blockIndexer, index: phaseValue },
        ...normalizeExtrinsic(extrinsic, events)
      }
      await extractEventBusinessData(
        event,
        normalizedExtrinsic,
        blockIndexer,
        sort
      );
    }
  }
}

module.exports = {
  handleEvents,
};
