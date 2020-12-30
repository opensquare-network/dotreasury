const { TipEvents, ProxyMethods, TipMethods } = require("../utils/constants");
const { hexToString } = require("@polkadot/util");
const { getTipCollection } = require("../mongo");
const { getApi } = require("../api");
const { median } = require("../utils");
const { logger } = require("../utils");

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

async function getTippersCount(blockHash) {
  const api = await getApi();
  const members = await api.query.electionsPhragmen.members.at(blockHash);
  return members.length;
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

  const reason = hexToString(reasonHex);
  const finder = extrinsic.signer;
  const meta = await getTipMeta(blockIndexer.blockHash, hash);
  const medianValue = computeTipValue(meta);

  const tippersCount = await getTippersCount(blockIndexer.blockHash);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer: blockIndexer,
    hash,
    reason,
    finder,
    medianValue,
    meta,
    tippersCount,
    isClosedOrRetracted: false,
    state: {
      indexer: extrinsic.extrinsicIndexer,
      state: TipEvents.NewTip,
      data: [hash],
    },
    timeline: [
      {
        type: "extrinsic",
        extrinsic,
      },
    ],
  });
}

async function updateTip(hash, state, data, indexer, extrinsic) {
  const updates = {};
  if (
    [TipEvents.TipClosed, TipEvents.TipRetracted].includes(state) ||
    state === TipMethods.closeTip
  ) {
    Object.assign(updates, { isClosedOrRetracted: true });
  }

  if (state === TipMethods.tip) {
    const tippersCount = await getTippersCount(indexer.blockHash);
    Object.assign(updates, { tippersCount });
  }

  const meta = await getTipMeta(indexer.blockHash, hash);
  if (meta) {
    const medianValue = computeTipValue(meta);
    Object.assign(updates, { meta, medianValue });
  }

  logger.info(`update tip with ${state} extrinsic ${extrinsic.hash}`);
  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash, isClosedOrRetracted: false },
    {
      $set: {
        ...updates,
        state: {
          indexer,
          state: state === TipMethods.closeTip ? TipEvents.TipClosed : state,
          data,
        },
      },
      $push: {
        timeline: {
          type: "extrinsic",
          extrinsic,
        },
      },
    }
  );
}

module.exports = {
  saveNewTip,
  updateTip,
};
