
const { getTipCollection } = require("../../mongo");

async function statTips(chain) {
  const counts = {};
  const proposers = new Set();
  const beneficiaries = new Set();

  const tipCol = await getTipCollection(chain);
  const tips = await tipCol.find().toArray();

  for (const tip of tips) {
    const finder = tip.finder;
    proposers.add(finder);
    counts[finder] = (counts[finder] ?? 0) + 1;

    const beneficiary = tip.meta?.who;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      if (beneficiary !== finder) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return { counts, proposers, beneficiaries };
}

module.exports = {
  statTips,
};
