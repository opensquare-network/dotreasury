const {
  TipEvents,
  TipMethods,
  Modules,
  ProxyMethods,
  ksmFirstTipClosedHeight,
} = require("../../utils/constants");
const {
  updateTipByTipExtrinsic,
  updateTipByFinalEvent,
} = require("../../store/tip");

async function handleTipExtrinsic(normalizedExtrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (section !== Modules.Treasury) {
    return;
  }

  if (
    name === TipMethods.closeTip &&
    normalizedExtrinsic.extrinsicIndexer.blockHeight < ksmFirstTipClosedHeight
  ) {
    await updateTipByFinalEvent(
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

module.exports = {
  handleTipExtrinsic,
  handleTipByProxy,
};
