const { handleTipExtrinsic, handleTipByProxy } = require("./treasury/tip");

async function extractExtrinsicBusinessData(normalizedExtrinsic) {
  if (!normalizedExtrinsic.isSuccess) {
    return;
  }

  await handleTipExtrinsic(normalizedExtrinsic);
  await handleTipByProxy(normalizedExtrinsic);
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
