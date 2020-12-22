const { handleTipExtrinsic } = require("./treasury/tip");

async function extractExtrinsicBusinessData(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  await handleTipExtrinsic(section, name, args, isSuccess, indexer, events);
}

module.exports = {
  extractExtrinsicBusinessData,
};
