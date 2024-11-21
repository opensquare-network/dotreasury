const dotenv = require("dotenv");
dotenv.config();

const BigNumber = require("bignumber.js");
const { statTipsV2 } = require("./statTips");
const { statProposalsV2 } = require("./statProposals");
const { statBounties } = require("./statBounties");
const { statChildBounties } = require("./statChildBounties");
const { statCouncilors } = require("./statCouncilors");

async function updateParticipantsV2() {
  console.log(`Update participants of ${process.env.CHAIN}`);

  const {
    counts: tipsCounts,
    proposers: tipProposers,
    proposeCounts: tipsProposeCounts,
    beneficiaries: tipBeneficiaries,
    beneficiaryCounts: tipsBeneficiaryCounts,
    totalBenefitFiatValues: totalTipBenefitFiatValues,
    totalBenefitValues: totalTipBenefitValues,
  } = await statTipsV2();

  const {
    counts: proposalsCounts,
    proposers: proposalProposers,
    proposeCounts: proposalsProposeCounts,
    beneficiaries: proposalBeneficiaries,
    beneficiaryCounts: proposalsBeneficiaryCounts,
    totalBenefitFiatValues: totalProposalBenefitFiatValues,
    totalBenefitValues: totalProposalBenefitValues,
  } = await statProposalsV2();

  const {
    counts: spendsCounts,
    proposers: spendProposers,
    proposeCounts: spendsProposeCounts,
    beneficiaries: spendBeneficiaries,
    beneficiaryCounts: spendsBeneficiaryCounts,
    totalBenefitFiatValues: totalSpendBenefitFiatValues,
    totalBenefitValues: totalSpendBenefitValues,
  } = await statSpendsV2();

  const {
    counts: bountiesCounts,
    proposers: bountyProposers,
    proposeCounts: bountiesProposedCounts,
    beneficiaries: bountyBeneficiaries,
    beneficiaryCounts: bountiesBeneficiaryCounts,
    totalBenefitFiatValues: totalBountyBenefitFiatValues,
    totalBenefitValues: totalBountyBenefitValues,
  } = await statBounties();

  const {
    counts: childBountiesCounts,
    proposers: childBountyProposers,
    proposeCounts: childBountyProposeCounts,
    beneficiaries: childBountyBeneficiaries,
    beneficiaryCounts: childBountyBeneficiaryCounts,
    totalBenefitFiatValues: totalChildBountyBenefitFiatValues,
    totalBenefitValues: totalChildBountyBenefitValues,
  } = await statChildBounties();

  const { councilors } = await statCouncilors();

  const participants = new Set([
    ...Object.keys(tipsCounts),
    ...Object.keys(proposalsCounts),
    ...Object.keys(spendsCounts),
    ...Object.keys(bountiesCounts),
    ...Object.keys(childBountiesCounts),
    ...councilors,
  ]);

  for (const address of participants) {
    const tipsCount = tipsCounts[address] ?? 0;
    const tipsProposeCount = tipsProposeCounts[address] ?? 0;
    const tipsBeneficiaryCount = tipsBeneficiaryCounts[address] ?? 0;
    const totalTipBenefitFiatValue = totalTipBenefitFiatValues[address] ?? 0;
    const totalTipBenefitValue = totalTipBenefitValues[address] ?? 0;

    const proposalsCount = proposalsCounts[address] ?? 0;
    const proposalsProposeCount = proposalsProposeCounts[address] ?? 0;
    const proposalsBeneficiaryCount = proposalsBeneficiaryCounts[address] ?? 0;
    const totalProposalBenefitFiatValue =
      totalProposalBenefitFiatValues[address] ?? 0;
    const totalProposalBenefitValue = totalProposalBenefitValues[address] ?? 0;

    const spendsCount = spendsCounts[address] ?? 0;
    const spendsProposeCount = spendsProposeCounts[address] ?? 0;
    const spendsBeneficiaryCount = spendsBeneficiaryCounts[address] ?? 0;
    const totalSpendBenefitFiatValue =
      totalSpendBenefitFiatValues[address] ?? 0;
    const totalSpendBenefitValue = totalSpendBenefitValues[address] ?? 0;

    const bountiesCount = bountiesCounts[address] ?? 0;
    const bountiesProposedCount = bountiesProposedCounts[address] ?? 0;
    const bountiesBeneficiaryCount = bountiesBeneficiaryCounts[address] ?? 0;
    const totalBountyBenefitFiatValue =
      totalBountyBenefitFiatValues[address] ?? 0;
    const totalBountyBenefitValue = totalBountyBenefitValues[address] ?? 0;

    const childBountiesCount = childBountiesCounts[address] ?? 0;
    const childBountyProposeCount = childBountyProposeCounts[address] ?? 0;
    const childBountyBeneficiaryCount =
      childBountyBeneficiaryCounts[address] ?? 0;
    const totalChildBountyBenefitFiatValue =
      totalChildBountyBenefitFiatValues[address] ?? 0;
    const totalChildBountyBenefitValue =
      totalChildBountyBenefitValues[address] ?? 0;

    const isProposer =
      tipProposers.has(address) ||
      proposalProposers.has(address) ||
      spendProposers.has(address) ||
      bountyProposers.has(address) ||
      childBountyProposers.has(address);

    const isBeneficiary =
      tipBeneficiaries.has(address) ||
      proposalBeneficiaries.has(address) ||
      spendBeneficiaries.has(address) ||
      bountyBeneficiaries.has(address) ||
      childBountyBeneficiaries.has(address);

    const isCouncilor = councilors.has(address);

    await saveParticipant(address, {
      tips: {
        count: tipsCount,
        proposedCount: tipsProposeCount,
        benefitCount: tipsBeneficiaryCount,
        benefitValue: totalTipBenefitValue,
        benefitFiatValue: totalTipBenefitFiatValue,
      },
      proposals: {
        count: proposalsCount,
        proposedCount: proposalsProposeCount,
        benefitCount: proposalsBeneficiaryCount,
        benefitValue: totalProposalBenefitValue,
        benefitFiatValue: totalProposalBenefitFiatValue,
      },
      spends: {
        count: spendsCount,
        proposedCount: spendsProposeCount,
        benefitCount: spendsBeneficiaryCount,
        benefitValue: totalSpendBenefitValue,
        benefitFiatValue: totalSpendBenefitFiatValue,
      },
      bounties: {
        count: bountiesCount,
        proposedCount: bountiesProposedCount,
        benefitCount: bountiesBeneficiaryCount,
        benefitValue: totalBountyBenefitValue,
        benefitFiatValue: totalBountyBenefitFiatValue,
      },
      childBounties: {
        count: childBountiesCount,
        proposedCount: childBountyProposeCount,
        benefitCount: childBountyBeneficiaryCount,
        benefitValue: totalChildBountyBenefitValue,
        benefitFiatValue: totalChildBountyBenefitFiatValue,
      },
      totalValue: {
        totalBenefit: new BigNumber(totalTipBenefitValue)
          .plus(totalProposalBenefitValue)
          .plus(totalSpendBenefitValue)
          .plus(totalBountyBenefitValue)
          .plus(totalChildBountyBenefitValue)
          .toString(),
      },
      totalFiatValue: {
        totalBenefit:
          totalTipBenefitFiatValue +
          totalProposalBenefitFiatValue +
          totalSpendBenefitFiatValue +
          totalBountyBenefitFiatValue +
          totalChildBountyBenefitFiatValue,
      },
      totalCount: {
        total:
          tipsCount +
          proposalsCount +
          spendsCount +
          bountiesCount +
          childBountiesCount,

        totalProposedCount:
          tipsProposeCount +
          proposalsProposeCount +
          spendsProposeCount +
          bountiesProposedCount +
          childBountyProposeCount,

        totalBenefitCount:
          tipsBeneficiaryCount +
          proposalsBeneficiaryCount +
          spendsBeneficiaryCount +
          bountiesBeneficiaryCount +
          childBountyBeneficiaryCount,
      },
      isProposer,
      isBeneficiary,
      isCouncilor,
    });
  }
}

module.exports = {
  updateParticipantsV2,
};
