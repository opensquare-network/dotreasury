const { handleTreasurySpend } = require("./spend");
const { queryPreimage } = require("../query/preimage");

function extractProposalHash(proposal) {
  if (proposal?.lookup) {
    return proposal?.lookup?.hash;
  } else if (proposal?.legacy) {
    return proposal?.legacy?.hash;
  }
  // todo: handle proposal inline type

  return null;
}

async function queryPreimageByProposal(proposal, indexer) {
  let hash;
  if (proposal?.lookup) {
    hash = proposal?.lookup?.hash;
  } else if (proposal?.legacy) {
    hash = proposal?.legacy?.hash;
  }

  if (!hash) {
    return null;
  }

  return await queryPreimage(hash, indexer.blockHash);
}

async function handleSubmitted(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  const track = event.data[1].toNumber();

  const proposal = event.data[2].toJSON();
  const proposalHash = extractProposalHash(proposal);
  const call = await queryPreimageByProposal(proposal, indexer);
  await handleTreasurySpend(referendumIndex, track, proposalHash, call, indexer);

  // todo: we will also handle other calls by referenda
}

module.exports = {
  handleSubmitted,
}
