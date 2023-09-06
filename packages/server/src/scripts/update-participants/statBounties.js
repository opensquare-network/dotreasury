
const { getBountyCollection } = require("../../mongo");

async function statBounties(chain) {
  const counts = {};
  const proposers = new Set();
  const beneficiaries = new Set();

  const bountyCol = await getBountyCollection(chain);
  const bounties = await bountyCol.find().toArray();

  for (const bounty of bounties) {
    const proposer = bounty.meta?.proposer;
    proposers.add(proposer);
    counts[proposer] = (counts[proposer] ?? 0) + 1;

    const beneficiary = bounty.meta?.status?.pendingPayout?.beneficiary;
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
  statBounties,
};
