const { handleTipExtrinsic } = require("./treasury/tip");
const { handleBountyExtrinsic } = require("./treasury/bounty");
const { handleProposalExtrinsic } = require("./treasury/proposal");

async function extractExtrinsicBusinessData(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  await handleTipExtrinsic(section, name, args, isSuccess, indexer, events);
  await handleBountyExtrinsic(section, name, args, isSuccess, indexer, events);
  await handleProposalExtrinsic(
    section,
    name,
    args,
    isSuccess,
    indexer,
    events
  );
}

module.exports = {
  extractExtrinsicBusinessData,
};
