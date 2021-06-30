const {
  TipMethods,
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

async function getCommonTipUpdates(blockHash, tipHash) {
  const tippersCount = await getTippersCount(blockHash);
  const meta = await getTipMeta(blockHash, tipHash);
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

  const updates = await getCommonTipUpdates(extrinsicIndexer.blockHash, hash);
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
  if (!isTipModule(section, indexer.blockHeight)) {
    return;
  }

  if (
    name !== TipMethods.closeTip ||
    indexer.blockHeight >= ksmFirstTipClosedHeight
  ) {
    return;
  }

  const { hash } = args.toJSON();
  await updateTipFinalStateByCall(
    author,
    hash,
    method,
    args.toJSON(),
    extrinsicIndexer
  );
}

module.exports = {
  handleTipCall,
  handleTipCloseCall,
};
