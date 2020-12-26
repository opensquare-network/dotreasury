const { hexToString } = require("@polkadot/util");
const { getExtrinsicSigner } = require("../utils");
const { getTipCollection, getTipTimelineCollection } = require("../mongo");
const { getApi } = require("../api");
const { median } = require("../utils");

async function getTipMeta(blockHash, tipHash) {
  const api = await getApi();
  const rawMeta = await api.query.treasury.tips.at(blockHash, tipHash);
  // FIXME: We should not change the origin meta data
  // if (meta?.reason) {
  //   const rawReasonText = await api.query.treasury.reasons.at(blockHash, meta.reason);
  //   meta.reasonText = rawReasonText.toHuman() || reasonFromArgs;
  // }
  // if (meta?.closes) {
  //   meta.tipCountdown = api.consts.treasury.tipCountdown.toNumber();
  // }
  // if (meta?.tips) {
  //   const members = await api.query.electionsPhragmen.members.at(blockHash);
  //   meta.tippers = members.map(item => item[0].toJSON());
  // }

  return rawMeta.toJSON();
}

async function getReasonStorageReasonText(reasonHash, blockHash) {
  const api = await getApi();

  const rawReasonText = await api.query.treasury.reasons.at(
    blockHash,
    reasonHash
  );
  return rawReasonText.toHuman();
}

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

async function saveNewTip(hash, extrinsic, indexer) {
  const signer = getExtrinsicSigner(extrinsic);
  const {
    args: { reason: reasonHex },
  } = extrinsic.method.toJSON();
  const meta = await getTipMeta(indexer.blockHash, hash);
  const reason = hexToString(reasonHex);
  const finder = signer;
  const medianValue = computeTipValue(meta);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer,
    hash,
    reason,
    finder,
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

  // await updateTip(hash, state, data, indexer, meta);
}

async function updateTip(hash, state, data, indexer) {
  const meta = await getTipMeta(indexer.blockHash, hash);

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
  updateTip,
  saveTipTimeline,
};
