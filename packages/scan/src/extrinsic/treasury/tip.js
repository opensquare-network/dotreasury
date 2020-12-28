const { TipMethods, Modules, ProxyMethods } = require("../../utils/constants");
const { saveTipTimeline, updateTip } = require("../../store/tip");

async function handleTipExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== Modules.Treasury) {
    return;
  }

  if (!isSuccess) {
    return;
  }

  if (name === TipMethods.tip) {
    await handleTip(args, indexer, events);
  }
}

// FIXME: not good to judge a tip proxy call
function isTipProxy(callArgs) {
  const keys = Object.keys(callArgs)
  return keys.includes('hash') && keys.includes('tip_value') && keys.length === 2
}

async function handleTipByProxy(section, name, args, indexer) {
  if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    return
  }

  const callArgs = args.call.args
  if (isTipProxy(callArgs)) {
    await updateTip(callArgs.hash, TipMethods.tip, callArgs, indexer)
  }
}

async function handleTip(args, indexer) {
  const { hash } = args;

  await saveTipTimeline(hash, TipMethods.tip, args, indexer);
  await updateTip(hash, TipMethods.tip, args, indexer);
}

module.exports = {
  handleTipExtrinsic,
  handleTipByProxy,
};
