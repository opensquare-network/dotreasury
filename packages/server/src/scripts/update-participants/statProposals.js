const { getProposalCollection } = require("../../mongo");

async function statProposals(chain) {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();

  const proposalCol = await getProposalCollection(chain);
  const proposals = await proposalCol.find().toArray();

  for (const proposal of proposals) {
    const proposer = proposal.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    const beneficiary = proposal.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return { counts, proposers, proposeCounts, beneficiaries, beneficiaryCounts };
}

module.exports = {
  statProposals,
};
