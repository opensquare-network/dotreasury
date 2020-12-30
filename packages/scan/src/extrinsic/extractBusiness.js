const { handleTipExtrinsic, handleTipByProxy } = require("./treasury/tip");

async function extractExtrinsicBusinessData(
  normalizedExtrinsic,
  extrinsicIndexer,
  events
) {
  if (!normalizedExtrinsic.isSuccess) {
    return;
  }

  await handleTipExtrinsic(normalizedExtrinsic, extrinsicIndexer, events);
  await handleTipByProxy(normalizedExtrinsic, extrinsicIndexer, events);
  // await handleBountyExtrinsic(section, name, args, isSuccess, indexer, events);
  // await handleProposalExtrinsic(
  //   section,
  //   name,
  //   args,
  //   isSuccess,
  //   indexer,
  //   events
  // );
  // await handleCouncilExtrinsic(section, name, args, isSuccess, indexer, events);
}

module.exports = {
  extractExtrinsicBusinessData,
};
