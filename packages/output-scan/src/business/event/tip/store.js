const { insertTipper } = require("../../../mongo/service/tipper");
const { computeTipValue } = require("../../common/tip/median");
const { getTipFindersFeeFromApi } = require("../../common/tip/utils");
const { getTippersCountFromApi } = require("../../common/tip/utils");
const { getBlockHash } = require("../../common");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const { insertTip, updateTipByHash, } = require("../../../mongo/service/tip");
const {
  getNewTipCall,
  getTipReason,
  getTipMetaFromStorage,
} = require("../../common/tip/utils");
const {
  chain: { findRegistry },
  consts: {
    TimelineItemTypes, TipMethods, TipEvents
  }
} = require("@osn/scan-common");
const { getFinderFromMeta, } = require("./utils");

async function saveNewTip(event, extrinsic, indexer) {
  const [rawHash] = event.data;
  const hash = rawHash.toString();
  const meta = await getTipMetaFromStorage(indexer.blockHash, hash);

  const finder = getFinderFromMeta(meta);
  const medianValue = computeTipValue(meta);

  const reasonHash = meta.reason;
  const registry = await findRegistry(indexer);
  const newTipCall = await getNewTipCall(
    registry,
    extrinsic.method,
    reasonHash
  );
  const method = newTipCall.method;

  const reason = await getTipReason(indexer.blockHash, reasonHash);
  meta.reason = reason;
  const beneficiary = newTipCall.args[1].toString();
  meta.findersFee = TipMethods.reportAwesome === method;
  const tippersCount = await getTippersCountFromApi(indexer.blockHash);
  const tipFindersFee = await getTipFindersFeeFromApi(indexer.blockHash);

  let tipValue;
  if (method === TipMethods.tipNew) {
    tipValue = newTipCall.args[2].toString();
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method,
    args: {
      reason,
      beneficiary,
      finder,
      tipValue,
    },
    indexer,
  };

  const state = {
    indexer,
    state: TipEvents.NewTip,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer,
    hash,
    reason,
    finder,
    medianValue,
    tippersCount,
    tipFindersFee,
    meta,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertTip(obj);
  if ((meta?.tips || []).length > 0) {
    const [tipper, value] = meta.tips[0]
    await insertTipper(hash, tipper, value, indexer);
  }
}

async function updateTipWithClosing(tipHash, indexer) {
  const updates = await getTipCommonUpdates(tipHash, indexer);
  await updateTipByHash(tipHash, updates);
}

async function updateTipWithTipClosed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, beneficiary, payout] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipClosed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipClosed,
    args: {
      beneficiary,
      payout,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

async function updateTipWithTipRetracted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipRetracted,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipRetracted,
    args: {},
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

async function updateTipWithTipSlashed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, finder, slashed] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipSlashed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipSlashed,
    args: {
      finder,
      slashed,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  saveNewTip,
  updateTipWithClosing,
  updateTipWithTipClosed,
  updateTipWithTipRetracted,
  updateTipWithTipSlashed,
};
