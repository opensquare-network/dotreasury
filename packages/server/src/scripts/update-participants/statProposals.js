const { getProposalCollection } = require("../../mongo");

async function statProposals() {
  const counts = {};
  const proposers = new Set();
  const beneficiaries = new Set();

  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol.find().toArray();

  for (const proposal of proposals) {
    const proposer = proposal.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;

    const beneficiary = proposal.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return { counts, proposers, beneficiaries };
}

module.exports = {
  statProposals,
};
