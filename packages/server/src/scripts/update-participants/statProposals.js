const BigNumber = require("bignumber.js");
const { getProposalCollection } = require("../../mongo");

async function statProposals(chain) {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();
  const totalFiatValues = {};
  const totalProposedFiatValues = {};
  const totalBenefitFiatValues = {};
  const totalValues = {};
  const totalProposedValues = {};
  const totalBenefitValues = {};

  const proposalCol = await getProposalCollection(chain);
  const proposals = await proposalCol.find().toArray();

  for (const proposal of proposals) {
    const proposer = proposal.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    totalValues[proposer] = new BigNumber(totalValues[proposer] ?? 0)
      .plus(proposal.value || 0)
      .toString();
    totalProposedValues[proposer] = new BigNumber(
      totalProposedValues[proposer] ?? 0,
    )
      .plus(proposal.value || 0)
      .toString();

    totalFiatValues[proposer] =
      (totalFiatValues[proposer] ?? 0) + (proposal.fiatValue || 0);
    totalProposedFiatValues[proposer] =
      (totalProposedFiatValues[proposer] ?? 0) + (proposal.fiatValue || 0);

    const beneficiary = proposal.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      totalBenefitValues[beneficiary] = new BigNumber(
        totalBenefitValues[beneficiary] ?? 0,
      )
        .plus(proposal.value || 0)
        .toString();

      totalBenefitFiatValues[beneficiary] =
        (totalBenefitFiatValues[beneficiary] ?? 0) + (proposal.fiatValue || 0);

      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;

        totalValues[beneficiary] = new BigNumber(totalValues[beneficiary] ?? 0)
          .plus(proposal.value || 0)
          .toString();

        totalFiatValues[beneficiary] =
          (totalFiatValues[beneficiary] ?? 0) + (proposal.fiatValue || 0);
      }
    }
  }

  return {
    counts,
    proposers,
    proposeCounts,
    beneficiaries,
    beneficiaryCounts,
    totalFiatValues,
    totalProposedFiatValues,
    totalBenefitFiatValues,
    totalValues,
    totalProposedValues,
    totalBenefitValues,
  };
}

module.exports = {
  statProposals,
};
