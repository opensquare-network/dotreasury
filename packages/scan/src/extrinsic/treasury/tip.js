const {
  TipMethods,
  TipEvents,
  Modules,
  ksmFirstTipClosedHeight,
  ksmTreasuryRefactorApplyHeight,
  dotTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const {
  getTippersCount,
  getTipMeta,
  computeTipValue,
} = require("../../store/tip");
const { getTipCollection } = require("../../mongo");
const { currentChain, CHAINS } = require("../../chain");
const { getTipMetaByBlockHeight } = require("../../store/tip");

function _isKsmTipModule(section, height) {
  return (
    section ===
    (height < ksmTreasuryRefactorApplyHeight ? Modules.Treasury : Modules.Tips)
  );
}

function _isDotTipModule(section, height) {
  return (
    section ===
    (height < dotTreasuryRefactorApplyHeight ? Modules.Treasury : Modules.Tips)
  );
}

function isTipModule(section, height) {
  const chain = currentChain();
  if (chain === CHAINS.POLKADOT) {
    return _isDotTipModule(section, height);
  } else if (chain === CHAINS.KUSAMA) {
    return _isKsmTipModule(section, height);
  }

  return section === Modules.Treasury;
}

async function updateTipInDbByCall(
  tipHash,
  updates,
  tipper,
  value,
  extrinsicIndexer
) {
  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash: tipHash, isClosedOrRetracted: false },
    {
      $set: updates,
      $push: {
        timeline: {
          type: "extrinsic",
          method: TipMethods.tip,
          args: {
            tipper,
            value,
          },
          extrinsicIndexer,
        },
      },
    }
  );
}

async function getCommonTipUpdates(tipHash, indexer) {
  const tippersCount = await getTippersCount(indexer.blockHash);
  const meta = await getTipMeta(tipHash, indexer);
  return { tippersCount, meta, medianValue: computeTipValue(meta) };
}

async function handleTipCall(call, author, extrinsicIndexer) {
  if (
    !isTipModule(call.section, extrinsicIndexer.blockHeight) ||
    TipMethods.tip !== call.method
  ) {
    return;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();

  const updates = await getCommonTipUpdates(hash, extrinsicIndexer);
  await updateTipInDbByCall(hash, updates, author, tipValue, extrinsicIndexer);
}

async function updateTipFinalStateByCall(
  author,
  tipHash,
  method,
  data,
  extrinsicIndexer
) {
  const meta = await getTipMetaByBlockHeight(
    extrinsicIndexer.blockHeight - 1,
    tipHash
  );
  const updates = {
    isClosedOrRetracted: true,
    meta,
    state: { indexer: extrinsicIndexer, state: method, data },
  };

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash: tipHash, isClosedOrRetracted: false },
    {
      $set: updates,
      $push: {
        timeline: {
          type: "extrinsic",
          method,
          args: {
            ...data,
            terminator: author,
          },
          extrinsicIndexer,
        },
      },
    }
  );
}

async function handleTipCloseCall(call, author, extrinsicIndexer) {
  const chain = currentChain();
  if (chain === CHAINS.POLKADOT) {
    return;
  }

  const { section, method, args } = call;
  const indexer = extrinsicIndexer;
  if (![Modules.Treasury, Modules.Tips].includes(section)) {
    return;
  }

  if (
    method !== TipMethods.closeTip ||
    indexer.blockHeight >= ksmFirstTipClosedHeight
  ) {
    return;
  }

  const hash = args[0].toJSON();
  await updateTipFinalStateByCall(
    author,
    hash,
    TipEvents.TipClosed,
    { hash },
    extrinsicIndexer
  );
}

module.exports = {
  handleTipCall,
  handleTipCloseCall,
};
