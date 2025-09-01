const BigNumber = require("bignumber.js");
const { getSubsquareTreasurySpendCollection } = require("../../mongo");

async function getStatsOfTreasurySpendItems(spends) {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();
  const totalBenefitFiatValues = {};
  const totalBenefitValues = {};

  for (const spend of spends) {
    const proposer = spend.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    const beneficiary = spend.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      if (["Paid", "Processed"].includes(spend.state?.state)) {
        totalBenefitValues[beneficiary] = new BigNumber(
          totalBenefitValues[beneficiary] ?? 0,
        )
          .plus(spend.value || 0)
          .toString();

        totalBenefitFiatValues[beneficiary] =
          (totalBenefitFiatValues[beneficiary] ?? 0) + (spend.fiatValue || 0);
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

async function statSpends() {
  const col = await getSubsquareTreasurySpendCollection();
  const spends = await col.find({ type: "treasurySpend" }).toArray();

  return await getStatsOfTreasurySpendItems(spends);
}

module.exports = {
  statSpends,
};
