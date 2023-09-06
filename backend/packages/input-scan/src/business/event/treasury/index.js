const { utils: { bigAdd } } = require("@osn/scan-common");
const { handleTipSlash } = require("./tipSlash");
const { handleBountySlash } = require("./bountySlash");
const { handleProposalSlash } = require("./proposalSlash");

async function handleTreasurySlash(event, indexer, blockEvents) {
  const proposal = await handleProposalSlash(event, indexer, blockEvents);
  const bounty = await handleBountySlash(event, indexer, blockEvents);
  const tip = await handleTipSlash(event, indexer, blockEvents);
  // todo: unasign curator slash

  let result = 0;
  if (proposal) {
    result = bigAdd(result, proposal.balance);
  }

  if (bounty) {
    result = bigAdd(result, bounty.balance);
  }

  if (tip) {
    result = bigAdd(result, tip.balance);
  }

  return result;
}

module.exports = {
  handleTreasurySlash,
}
