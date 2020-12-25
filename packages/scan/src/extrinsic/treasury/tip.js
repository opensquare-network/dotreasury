const { TipMethods, Modules } = require("../../utils/constants");
const { saveTipTimeline } = require("../../store/tip");

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

  // Tip methods
  if (name === TipMethods.tip) {
    await handleTip(args, indexer, events);
  }
}

async function handleTip(args, indexer, events) {
  const { hash, tip_value: tipValue } = args;

  await saveTipTimeline(hash, TipMethods.tip, args, indexer);
}

module.exports = {
  handleTipExtrinsic,
};
