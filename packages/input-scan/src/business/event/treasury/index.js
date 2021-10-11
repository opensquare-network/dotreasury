const { handleTipSlash } = require("./tipSlash");
const { handleBountySlash } = require("./bountySlash");
const { handleProposalSlash } = require("./proposalSlash");

async function handleTreasurySlash(event, indexer, blockEvents) {
  await handleProposalSlash(event, indexer, blockEvents);
  await handleBountySlash(event, indexer, blockEvents);
  await handleTipSlash(event, indexer, blockEvents);
  // todo: unasign curator slash
}

module.exports = {
  handleTreasurySlash,
}
