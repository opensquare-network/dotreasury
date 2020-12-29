const { extractEventBusinessData } = require("./extractBusiness");
const { getEventCollection } = require("../mongo");
const { normalizeExtrinsic } = require("../extrinsic/index")

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  const eventCol = await getEventCollection();
  const bulk = eventCol.initializeOrderedBulkOp();

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase, topics } = events[sort];
    const phaseType = phase.type;
    let [phaseValue, extrinsicHash, extrinsic] = [null, null, null];
    if (!phase.isNull) {
      phaseValue = phase.value.toNumber();
      extrinsic = extrinsics[phaseValue];
      extrinsicHash = extrinsic.hash.toHex();

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

    const index = parseInt(event.index);
    const meta = event.meta.toJSON();
    const section = event.section;
    const method = event.method;
    const data = event.data.toJSON();

    bulk.insert({
      indexer: blockIndexer,
      extrinsicHash,
      phase: {
        type: phaseType,
        value: phaseValue,
      },
      sort,
      index,
      section,
      method,
      meta,
      data,
      topics,
    });
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: Deal with db failura
  }
}

module.exports = {
  handleEvents,
};
