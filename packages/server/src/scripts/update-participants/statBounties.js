const BigNumber = require("bignumber.js");
const { getBountyCollection } = require("../../mongo");

async function statBounties(chain) {
  const counts = {};
  const proposers = new Set();
  const proposeCounts = {};
  const beneficiaries = new Set();
  const beneficiaryCounts = {};
  const totalFiatValues = {};
  const totalProposedFiatValues = {};
  const totalBenefitFiatValues = {};
  const totalValues = {};
  const totalProposedValues = {};
  const totalBenefitValues = {};

  const bountyCol = await getBountyCollection(chain);
  const bounties = await bountyCol.find().toArray();

  for (const bounty of bounties) {
    const proposer = bounty.meta?.proposer;
    proposers.add(proposer);

    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    totalValues[proposer] = new BigNumber(totalValues[proposer] ?? 0)
      .plus(bounty.value || 0)
      .toString();
    totalProposedValues[proposer] = new BigNumber(
      totalProposedValues[proposer] ?? 0,
    )
      .plus(bounty.value || 0)
      .toString();

    totalFiatValues[proposer] =
      (totalFiatValues[proposer] ?? 0) + (bounty.fiatValue || 0);
    totalProposedFiatValues[proposer] =
      (totalProposedFiatValues[proposer] ?? 0) + (bounty.fiatValue || 0);

    const beneficiary = bounty.meta?.status?.pendingPayout?.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      totalBenefitValues[beneficiary] = new BigNumber(
        totalBenefitValues[beneficiary] ?? 0,
      )
        .plus(bounty.value || 0)
        .toString();

      totalBenefitFiatValues[beneficiary] =
        (totalBenefitFiatValues[beneficiary] ?? 0) + (bounty.fiatValue || 0);

      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;

        totalValues[beneficiary] = new BigNumber(totalValues[beneficiary] ?? 0)
          .plus(bounty.value || 0)
          .toString();

        totalFiatValues[beneficiary] =
          (totalFiatValues[beneficiary] ?? 0) + (bounty.fiatValue || 0);
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
  statBounties,
};
