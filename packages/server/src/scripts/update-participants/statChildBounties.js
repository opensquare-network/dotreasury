
const { getChildBountyCollection } = require("../../mongo");

async function statChildBounties(chain) {
  const counts = {};
  const proposers = new Set();
  const beneficiaries = new Set();

  const childBountyCol = await getChildBountyCollection(chain);
  const childBounties = await childBountyCol.find().toArray();

  for (const childBounty of childBounties) {
    const proposer = childBounty.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;

    const beneficiary = childBounty.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      if (beneficiary !== proposer) {
        counts[beneficiary] = (counts[beneficiary] ?? 0) + 1;
      }
    }
  }

  return { counts, proposers, beneficiaries };
}

module.exports = {
  statChildBounties,
};
