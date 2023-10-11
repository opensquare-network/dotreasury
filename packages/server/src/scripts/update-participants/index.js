const dotenv = require("dotenv");
dotenv.config();

const BigNumber = require("bignumber.js");
const { getParticipantCollection } = require("../../mongo");
const { statTips } = require("./statTips");
const { statProposals } = require("./statProposals");
const { statBounties } = require("./statBounties");
const { statChildBounties } = require("./statChildBounties");
const { statCouncilors } = require("./statCouncilors");

async function saveParticipant(address, data) {
  const participantCol = await getParticipantCollection();
  await participantCol.updateOne({ address }, { $set: data }, { upsert: true });
}

async function updateParticipants() {
  console.log(`Update participants of ${process.env.CHAIN}`);

  const {
    counts: tipsCounts,
    proposers: tipProposers,
    proposeCounts: tipsProposeCounts,
    beneficiaries: tipBeneficiaries,
    beneficiaryCounts: tipsBeneficiaryCounts,
    totalBenefitFiatValues: totalTipBenefitFiatValues,
    totalBenefitValues: totalTipBenefitValues,
  } = await statTips();

  const {
    counts: proposalsCounts,
    proposers: proposalProposers,
    proposeCounts: proposalsProposeCounts,
    beneficiaries: proposalBeneficiaries,
    beneficiaryCounts: proposalsBeneficiaryCounts,
    totalBenefitFiatValues: totalProposalBenefitFiatValues,
    totalBenefitValues: totalProposalBenefitValues,
  } = await statProposals();

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
      bountyProposers.has(address) ||
      childBountyProposers.has(address);

    const isBeneficiary =
      tipBeneficiaries.has(address) ||
      proposalBeneficiaries.has(address) ||
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
          .plus(totalBountyBenefitValue)
          .plus(totalChildBountyBenefitValue)
          .toString(),
      },
      totalFiatValue: {
        totalBenefit:
          totalTipBenefitFiatValue +
          totalProposalBenefitFiatValue +
          totalBountyBenefitFiatValue +
          totalChildBountyBenefitFiatValue,
      },
      totalCount: {
        total: tipsCount + proposalsCount + bountiesCount + childBountiesCount,

        totalProposedCount:
          tipsProposeCount +
          proposalsProposeCount +
          bountiesProposedCount +
          childBountyProposeCount,

        totalBenefitCount:
          tipsBeneficiaryCount +
          proposalsBeneficiaryCount +
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
  updateParticipants,
}
