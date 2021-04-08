const {
  TipEvents,
  TipMethods,
  Modules,
  ProxyMethods,
  ksmFirstTipClosedHeight,
  MultisigMethods,
  UtilityMethods,
  ksmTreasuryRefactorApplyHeight,
  dotTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const {
  updateTipFinalState,
  getTippersCount,
  getTipMeta,
  computeTipValue,
} = require("../../store/tip");
const { getTipCollection } = require("../../mongo");
const { getCall, getMultiSigExtrinsicAddress } = require("../../utils/call");
const { currentChain, CHAINS } = require("../../chain");

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

async function handleCloseTipExtrinsic(normalizedExtrinsic) {
  const chain = currentChain();
  if (chain === CHAINS.POLKADOT) {
    return false;
  }

  const { section, name, args } = normalizedExtrinsic;
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  if (!isTipModule(section, indexer.blockHeight)) {
    return false;
  }

  if (
    name === TipMethods.closeTip &&
    indexer.blockHeight < ksmFirstTipClosedHeight
  ) {
    await updateTipFinalState(
      args.hash,
      TipEvents.TipClosed,
      args,
      normalizedExtrinsic
    );
    return true;
  }

  return false;
}

async function handleTip(normalizedExtrinsic) {
  const {
    section,
    name,
    args: { hash, tip_value: tipValue },
  } = normalizedExtrinsic;
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  if (!isTipModule(section, indexer.blockHeight) || name !== TipMethods.tip) {
    return false;
  }

  const updates = await getCommonTipUpdates(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    hash
  );
  const tipper = normalizedExtrinsic.signer;
  await updateTipInDB(hash, updates, tipper, tipValue, normalizedExtrinsic);
  return true;
}

async function updateTipInDB(
  hash,
  updates,
  tipper,
  value,
  normalizedExtrinsic
) {
  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash, isClosedOrRetracted: false },
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
          extrinsic: normalizedExtrinsic,
        },
      },
    }
  );
}

async function handleTipByProxy(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    return false;
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const callHex = extrinsic.args[2].toHex();
  const call = await getCall(indexer.blockHash, callHex);

  if (
    !isTipModule(call.section, indexer.blockHeight) ||
    TipMethods.tip !== call.method
  ) {
    return false;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();
  const updates = await getCommonTipUpdates(indexer.blockHash, hash);
  const tipper = args.real;
  await updateTipInDB(hash, updates, tipper, tipValue, normalizedExtrinsic);
  return true;
}

async function getCommonTipUpdates(blockHash, tipHash) {
  const tippersCount = await getTippersCount(blockHash);
  const meta = await getTipMeta(blockHash, tipHash);
  return { tippersCount, meta, medianValue: computeTipValue(meta) };
}

async function handleTipByMultiSig(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Multisig !== section || MultisigMethods.asMulti !== name) {
    return false;
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const blockHash = indexer.blockHash;
  const rawCall = extrinsic.method.args[3].toHex();
  const call = await getCall(blockHash, rawCall);
  // TODO: check whether there are multisig batch extrinsic, tip maybe wrapped in the multisig batch tip action
  if (
    !isTipModule(call.section, indexer.blockHeight) ||
    TipMethods.tip !== call.method
  ) {
    return false;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();
  const updates = await getCommonTipUpdates(blockHash, hash);
  const tipper = await getMultiSigExtrinsicAddress(
    args,
    normalizedExtrinsic.signer
  );
  await updateTipInDB(hash, updates, tipper, tipValue, normalizedExtrinsic);

  return true;
}

async function handleTipByBatch(normalizedExtrinsic, extrinsic) {
  const { section, name } = normalizedExtrinsic;

  if (Modules.Utility !== section || UtilityMethods.batch !== name) {
    return false;
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  let hasTip = false;
  const blockHash = indexer.blockHash;
  const batchCalls = extrinsic.method.args[0];
  for (const callInBatch of batchCalls) {
    const rawCall = callInBatch.toHex();
    const call = await getCall(blockHash, rawCall);

    if (
      !isTipModule(call.section, indexer.blockHeight) ||
      TipMethods.tip !== call.method
    ) {
      continue;
    }

    hasTip = true;
    const {
      args: { hash, tip_value: tipValue },
    } = call.toJSON();
    const updates = await getCommonTipUpdates(blockHash, hash);
    const tipper = normalizedExtrinsic.signer;
    await updateTipInDB(hash, updates, tipper, tipValue, normalizedExtrinsic);
  }

  return hasTip;
}

module.exports = {
  handleCloseTipExtrinsic,
  handleTipByProxy,
  handleTipByMultiSig,
  handleTip,
  handleTipByBatch,
};
