const { getChildBountyCollection } = require("../../mongo");

async function statChildBounties() {
  const counts = {};
  const proposers = new Set();
  const proposeCounts = {};
  const beneficiaries = new Set();
  const beneficiaryCounts = {};

  const childBountyCol = await getChildBountyCollection();
  const childBounties = await childBountyCol.find().toArray();

  for (const childBounty of childBounties) {
    const proposer = childBounty.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    const beneficiary = childBounty.beneficiary;
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
  statChildBounties,
};
