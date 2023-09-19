const BigNumber = require("bignumber.js");
const { getBountyCollection } = require("../../mongo");

function getDecimals() {
  const chain = process.env.CHAIN;
  if (chain === "kusama") {
    return 12;
  } else if (chain === "polkadot") {
    return 10;
  } else {
    throw new Error(`Unknown chain ${chain}`);
  }
}

async function statBounties() {
  const counts = {};
  const proposers = new Set();
  const proposeCounts = {};
  const beneficiaries = new Set();
  const beneficiaryCounts = {};
  const totalBenefitFiatValues = {};
  const totalBenefitValues = {};

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find().toArray();

  for (const bounty of bounties) {
    const proposer = bounty.meta?.proposer;
    proposers.add(proposer);

    counts[proposer] = (counts[proposer] ?? 0) + 1;
    proposeCounts[proposer] = (proposeCounts[proposer] ?? 0) + 1;

    const beneficiary = bounty.meta?.status?.pendingPayout?.beneficiary;
    if (beneficiary) {
      beneficiaries.add(beneficiary);
      beneficiaryCounts[beneficiary] =
        (beneficiaryCounts[beneficiary] ?? 0) + 1;

      if (bounty.state?.state === "Claimed") {
        const claimed = bounty.timeline?.find(
          (item) => item.name === "BountyClaimed",
        );
        totalBenefitValues[beneficiary] = new BigNumber(
          totalBenefitValues[beneficiary] ?? 0,
        )
          .plus(claimed?.args?.balance || 0)
          .toString();

        const decimals = getDecimals();
        const fiatValue = new BigNumber(claimed?.args?.balance || 0)
          .div(Math.pow(10, decimals))
          .times(bounty.symbolPrice || 0)
          .toNumber();

        totalBenefitFiatValues[beneficiary] =
          (totalBenefitFiatValues[beneficiary] ?? 0) + fiatValue;
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

module.exports = {
  statBounties,
};
