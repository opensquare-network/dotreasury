const BigNumber = require("bignumber.js");
const { getTipCollection } = require("../../mongo");

async function statTips(chain) {
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

  const tipCol = await getTipCollection(chain);
  const tips = await tipCol.find().toArray();

  for (const tip of tips) {
    const finder = tip.finder;
    proposers.add(finder);
    counts[finder] = (counts[finder] ?? 0) + 1;
    proposeCounts[finder] = (proposeCounts[finder] ?? 0) + 1;

    totalValues[finder] = new BigNumber(totalValues[finder] ?? 0)
      .plus(tip.value || 0)
      .toString();
    totalProposedValues[finder] = new BigNumber(
      totalProposedValues[finder] ?? 0,
    )
      .plus(tip.value || 0)
      .toString();

    totalFiatValues[finder] =
      (totalFiatValues[finder] ?? 0) + (tip.fiatValue || 0);
    totalProposedFiatValues[finder] =
      (totalProposedFiatValues[finder] ?? 0) + (tip.fiatValue || 0);

    const beneficiary = tip.meta?.who;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      totalBenefitValues[beneficiary] = new BigNumber(
        totalBenefitValues[beneficiary] ?? 0,
      )
        .plus(tip.value || 0)
        .toString();

      totalBenefitFiatValues[beneficiary] =
        (totalBenefitFiatValues[beneficiary] ?? 0) + (tip.fiatValue || 0);

      if (beneficiary !== finder) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;

        totalValues[beneficiary] = new BigNumber(totalValues[beneficiary] ?? 0)
          .plus(tip.value || 0)
          .toString();

        totalFiatValues[beneficiary] =
          (totalFiatValues[beneficiary] ?? 0) + (tip.fiatValue || 0);
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
  statTips,
};
