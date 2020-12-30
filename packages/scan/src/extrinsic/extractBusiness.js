const { handleTipExtrinsic, handleTipByProxy } = require("./treasury/tip");
const { logger } = require("../utils");

async function extractExtrinsicBusinessData(
  normalizedExtrinsic,
  extrinsicIndexer,
  events
) {
  if (!normalizedExtrinsic.isSuccess) {
    return;
  }

  logger.info(`begin handleTipExtrinsic and handleTipByProxy`);
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
