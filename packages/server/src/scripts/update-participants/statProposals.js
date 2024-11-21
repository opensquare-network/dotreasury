const BigNumber = require("bignumber.js");
const { getProposalCollection } = require("../../mongo");

async function getStatsOfTreasuryProposalItems(proposals) {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();
  const totalBenefitFiatValues = {};
  const totalBenefitValues = {};

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

      if (proposal.state?.state === "Awarded") {
        totalBenefitValues[beneficiary] = new BigNumber(
          totalBenefitValues[beneficiary] ?? 0,
        )
          .plus(proposal.value || 0)
          .toString();

        totalBenefitFiatValues[beneficiary] =
          (totalBenefitFiatValues[beneficiary] ?? 0) +
          (proposal.fiatValue || 0);
      }

      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return {
    counts,
    proposers,
    proposeCounts,
    beneficiaries,
    beneficiaryCounts,
    totalBenefitFiatValues,
    totalBenefitValues,
  };
}

async function statProposals() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol.find().toArray();

  return await getStatsOfTreasuryProposalItems(proposals);
}

async function statProposalsV2() {
  const col = await getSubsquareTreasurySpendCollection();
  const proposals = await col.find({ type: "treasuryProposal" }).toArray();

  return await getStatsOfTreasuryProposalItems(proposals);
}

module.exports = {
  statProposals,
  statProposalsV2,
};
