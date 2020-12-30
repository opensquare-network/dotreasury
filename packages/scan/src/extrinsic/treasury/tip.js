const {
  TipMethods,
  Modules,
  ProxyMethods,
  ksmFirstTipClosedHeight,
} = require("../../utils/constants");
const { updateTip } = require("../../store/tip");

async function handleTipExtrinsic(normalizedExtrinsic, extrinsicIndexer) {
  const { section, name, args } = normalizedExtrinsic;

  if (section !== Modules.Treasury) {
    return;
  }

  const noEventTipClose =
    name === TipMethods.closeTip &&
    extrinsicIndexer.blockHeight < ksmFirstTipClosedHeight;
  if (name === TipMethods.tip || noEventTipClose) {
    await updateTip(args.hash, name, args, extrinsicIndexer, {
      ...normalizedExtrinsic,
      extrinsicIndexer,
    });
  }
}

// FIXME: not good to judge a tip proxy call
function isTipProxy(callArgs) {
  const keys = Object.keys(callArgs);
  return (
    keys.includes("hash") && keys.includes("tip_value") && keys.length === 2
  );
}

async function handleTipByProxy(normalizedExtrinsic, extrinsicIndexer) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    return;
  }

  const callArgs = args.call.args;
  if (isTipProxy(callArgs)) {
    await updateTip(callArgs.hash, TipMethods.tip, callArgs, extrinsicIndexer, {
      ...normalizedExtrinsic,
      extrinsicIndexer,
    });
  }
}

module.exports = {
  handleTipExtrinsic,
  handleTipByProxy,
};
