const { TipMethods, Modules } = require("../../utils/constants");
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

async function handleTip(args, indexer) {
  const { hash } = args;

  await saveTipTimeline(hash, TipMethods.tip, args, indexer);
  await updateTip(hash, TipMethods.tip, args, indexer);
}

module.exports = {
  handleTipExtrinsic,
};
