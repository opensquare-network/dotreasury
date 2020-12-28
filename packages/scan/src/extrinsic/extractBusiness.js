const { handleTipExtrinsic, handleTipByProxy } = require("./treasury/tip");
const { handleBountyExtrinsic } = require("./treasury/bounty");
const { handleProposalExtrinsic } = require("./treasury/proposal");
const { handleCouncilExtrinsic } = require("./council");

async function extractExtrinsicBusinessData(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (!isSuccess) {
    return
  }

  await handleTipExtrinsic(section, name, args, isSuccess, indexer, events);
  await handleTipByProxy(section, name, args, indexer);
  await handleBountyExtrinsic(section, name, args, isSuccess, indexer, events);
  await handleProposalExtrinsic(
    section,
    name,
    args,
    isSuccess,
    indexer,
    events
  );
  await handleCouncilExtrinsic(section, name, args, isSuccess, indexer, events);
}

module.exports = {
  extractExtrinsicBusinessData,
};
