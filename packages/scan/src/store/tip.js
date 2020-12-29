const { TipEvents, ProxyMethods } = require("../utils/constants");
const { hexToString } = require("@polkadot/util");
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

async function saveNewTip(hash, extrinsic, blockIndexer) {
  let reasonHex;
  if (extrinsic.name === ProxyMethods.proxy) {
    reasonHex = extrinsic.args.call.args.reason;
  } else {
    reasonHex = extrinsic.args.reason;
  }

  const meta = await getTipMeta(blockIndexer.blockHash, hash);
  const reason = hexToString(reasonHex);
  const finder = extrinsic.signer;
  const medianValue = computeTipValue(meta);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer: blockIndexer,
    hash,
    reason,
    finder,
    medianValue,
    meta,
    isClosedOrRetracted: false,
    timeline: [
      {
        type: 'extrinsic',
        extrinsic
      },
    ]
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

async function updateTip(hash, state, data, indexer, extrinsic) {
  const meta = await getTipMeta(indexer.blockHash, hash);

  const updates = {};
  if ([TipEvents.TipClosed, TipEvents.TipRetracted].includes(state)) {
    Object.assign(updates, { isClosedOrRetracted: true });
  }

  if (meta) {
    const medianValue = computeTipValue(meta);
    Object.assign(updates, { meta, medianValue });
  }

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash, isClosedOrRetracted: false },
    {
      $set: {
        ...updates,
        state: {
          indexer,
          state,
          data,
        },
      },
      $push: {
        timeline: {
          type: 'extrinsic',
          extrinsic
        }
      }
    }
  );
}

module.exports = {
  saveNewTip,
  updateTip,
  saveTipTimeline,
};
