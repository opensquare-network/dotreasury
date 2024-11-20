const BigNumber = require("bignumber.js");
const {
  getSubsquareTreasurySpendCollection,
} = require("../../../mongo/polkadot");

async function getSpendsTotalExpenditure(ctx) {
  const col = await getSubsquareTreasurySpendCollection();
  let totalFiatValue = new BigNumber(0);

  const treasuryProposals = await col
    .find({
      type: "treasuryProposal",
      "state.state": { $in: ["Approved", "Awarded"] },
    })
    .toArray();
  for (const proposal of treasuryProposals) {
    totalFiatValue = totalFiatValue.plus(proposal.fiatValue || 0);
  }

  const treasurySpends = await col
    .find({
      type: "treasurySpend",
      "state.state": { $in: ["Approved", "Paid", "Processed"] },
    })
    .toArray();
  for (const spend of treasurySpends) {
    totalFiatValue = totalFiatValue.plus(spend.fiatValue || 0);
  }

  const tips = await col
    .find({
      type: "tip",
      "state.state": "TipClosed",
    })
    .toArray();
  for (const tip of tips) {
    totalFiatValue = totalFiatValue.plus(tip.fiatValue || 0);
  }

  ctx.body = {
    totalFiatValue: totalFiatValue.toFixed(),
  };
}

module.exports = {
  getSpendsTotalExpenditure,
};
