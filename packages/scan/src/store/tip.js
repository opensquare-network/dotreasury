const { getTipCollection, getTipTimelineCollection } = require("../mongo");
const { getApi } = require("../api");
const { median } = require("../utils");

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

async function saveNewTip(hash, indexer) {
  const api = await getApi();
  let meta = await api.query.treasury.tips.at(indexer.blockHash, hash);
  meta = meta.toJSON();

  const medianValue = computeTipValue(meta);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer,
    hash,
    medianValue,
    meta,
  });
}

async function saveTipTimeline(hash, state, data, indexer, sort) {
  const api = await getApi();
  let meta = await api.query.treasury.tips.at(indexer.blockHash, hash);
  meta = meta.toJSON();

  const tipTimelineCol = await getTipTimelineCollection();
  await tipTimelineCol.insertOne({
    indexer,
    sort,
    hash,
    state,
    data,
    meta,
  });

  await updateTip(hash, state, data, indexer, meta);
}

async function updateTip(hash, state, data, indexer, meta) {
  let updates = {};
  if (meta) {
    const medianValue = computeTipValue(meta);
    updates = { meta, medianValue };
  }

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash },
    {
      $set: {
        ...updates,
        state: {
          indexer,
          state,
          data,
        },
      },
    }
  );
}

module.exports = {
  saveNewTip,
  saveTipTimeline,
};
