const { getTipCollection } = require("../../mongo");

async function statTips() {
  const counts = {};
  const proposeCounts = {};
  const proposers = new Set();
  const beneficiaryCounts = {};
  const beneficiaries = new Set();

  const tipCol = await getTipCollection();
  const tips = await tipCol.find().toArray();

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

      if (beneficiary !== finder) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return { counts, proposers, proposeCounts, beneficiaries, beneficiaryCounts };
}

module.exports = {
  statTips,
};
