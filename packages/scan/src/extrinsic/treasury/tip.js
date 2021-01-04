const {
  TipEvents,
  TipMethods,
  Modules,
  ProxyMethods,
  ksmFirstTipClosedHeight,
  MultisigMethods,
} = require("../../utils/constants");
const {
  updateTipByTipExtrinsic,
  updateTipFinalState,
  getTippersCount,
  getTipMeta,
  computeTipValue,
} = require("../../store/tip");
const { getApi } = require("../../api");
const { GenericCall } = require("@polkadot/types");
const { getTipCollection } = require("../../mongo");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");

async function handleTipExtrinsic(normalizedExtrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (section !== Modules.Treasury) {
    return;
  }

  if (
    name === TipMethods.closeTip &&
    normalizedExtrinsic.extrinsicIndexer.blockHeight < ksmFirstTipClosedHeight
  ) {
    await updateTipFinalState(
      args.hash,
      TipEvents.TipClosed,
      args,
      normalizedExtrinsic
    );
  } else if (name === TipMethods.tip) {
    await updateTipByTipExtrinsic(
      args.hash,
      TipMethods.tip,
      args,
      normalizedExtrinsic
    );
  }
}

// FIXME: not good to judge a tip proxy call
function isTipProxy(callArgs) {
  const keys = Object.keys(callArgs);
  return (
    keys.includes("hash") && keys.includes("tip_value") && keys.length === 2
  );
}

async function handleTipByProxy(normalizedExtrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    return;
  }

  const callArgs = args.call.args;
  if (isTipProxy(callArgs)) {
    await updateTipByTipExtrinsic(
      callArgs.hash,
      TipMethods.tip,
      callArgs,
      normalizedExtrinsic
    );
  }
}

async function handleTipByMultiSig(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Multisig !== section || MultisigMethods.asMulti !== name) {
    return;
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const {
    threshold,
    other_signatories: otherSignatories,
    call: rawCall,
  } = args;

  const api = await getApi();
  const registry = await api.getBlockRegistry(indexer.blockHash);
  const call = new GenericCall(registry.registry, rawCall);
  if (Modules.Treasury !== call.section || TipMethods.tip !== call.method) {
    return;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();
  const tippersCount = await getTippersCount(indexer.blockHash);
  const meta = await getTipMeta(indexer.blockHash, hash);
  const updates = { tippersCount, meta, medianValue: computeTipValue(meta) };

  const multiAddresses = [normalizedExtrinsic.signer, ...otherSignatories];
  const multiPub = createKeyMulti(multiAddresses, threshold);
  const tipper = encodeAddress(multiPub, registry.registry.chainSS58);

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
            value: tipValue,
          },
          extrinsic,
        },
      },
    }
  );
}

module.exports = {
  handleTipExtrinsic,
  handleTipByProxy,
  handleTipByMultiSig,
};
