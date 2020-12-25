const { getTipCollection, getTipTimelineCollection } = require("../mongo");
const { getApi } = require("../api");
const { median } = require("../utils");
const { hexToString } = require("@polkadot/util");


async function getTipMeta(blockHash, tipHash) {
  const api = await getApi();
  const rawMeta = await api.query.treasury.tips.at(blockHash, tipHash);
  const meta = rawMeta.toJSON();
  if (meta?.reason) {
    const rawReasonText = await api.query.treasury.reasons.at(blockHash, meta.reason);
    const reasonText = rawReasonText.toJSON();
    meta.reasonText = hexToString(reasonText);
  }

  return meta;
}

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

async function saveNewTip(hash, indexer) {
  const meta = await getTipMeta(indexer.blockHash, hash);
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
  const meta = await getTipMeta(indexer.blockHash, hash);

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
