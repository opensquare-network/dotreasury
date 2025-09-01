const BigNumber = require("bignumber.js");
const { getTipCollection } = require("../../mongo");
const { getSubsquareTreasurySpendCollection } = require("../../mongo");

async function getStatsOfTipItems(tips) {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();
  const totalBenefitFiatValues = {};
  const totalBenefitValues = {};

  for (const tip of tips) {
    const finder = tip.finder;
    proposers.add(finder);
    counts[finder] = (counts[finder] ?? 0) + 1;
    proposeCounts[finder] = (proposeCounts[finder] ?? 0) + 1;

    const beneficiary = tip.meta?.who;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      if (tip.state?.state === "TipClosed") {
        totalBenefitValues[beneficiary] = new BigNumber(
          totalBenefitValues[beneficiary] ?? 0,
        )
          .plus(tip.value || 0)
          .toString();

        totalBenefitFiatValues[beneficiary] =
          (totalBenefitFiatValues[beneficiary] ?? 0) + (tip.fiatValue || 0);
      }

      if (beneficiary !== finder) {
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

async function statTips() {
  const tipCol = await getTipCollection();
  const tips = await tipCol.find().toArray();

  return await getStatsOfTipItems(tips);
}

async function statTipsV2() {
  const col = await getSubsquareTreasurySpendCollection();
  const tips = await col.find({ type: "tip" }).toArray();

  return await getStatsOfTipItems(tips);
}

module.exports = {
  statTips,
  statTipsV2,
};
