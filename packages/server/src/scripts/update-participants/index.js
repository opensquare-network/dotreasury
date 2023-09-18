const dotenv = require("dotenv");
dotenv.config();

const BigNumber = require("bignumber.js");
const { getParticipantCollection } = require("../../mongo");
const { statTips } = require("./statTips");
const { statProposals } = require("./statProposals");
const { statBounties } = require("./statBounties");
const { statChildBounties } = require("./statChildBounties");
const { statCouncilors } = require("./statCouncilors");

async function saveParticipant(chain, address, data) {
  const participantCol = await getParticipantCollection(chain);
  await participantCol.updateOne({ address }, { $set: data }, { upsert: true });
}

async function updateParticipants(chain) {
  console.log(`Update participants of ${chain}`);

  const {
    counts: tipsCounts,
    proposers: tipProposers,
    proposeCounts: tipsProposeCounts,
    beneficiaries: tipBeneficiaries,
    beneficiaryCounts: tipsBeneficiaryCounts,
    totalFiatValues: totalTipFiatValues,
    totalProposedFiatValues: totalTipProposedFiatValues,
    totalBenefitFiatValues: totalTipBenefitFiatValues,
    totalValues: totalTipValues,
    totalProposedValues: totalTipProposedValues,
    totalBenefitValues: totalTipBenefitValues,
  } = await statTips(chain);

  const {
    counts: proposalsCounts,
    proposers: proposalProposers,
    proposeCounts: proposalsProposeCounts,
    beneficiaries: proposalBeneficiaries,
    beneficiaryCounts: proposalsBeneficiaryCounts,
    totalFiatValues: totalProposalFiatValues,
    totalProposedFiatValues: totalProposalProposedFiatValues,
    totalBenefitFiatValues: totalProposalBenefitFiatValues,
    totalValues: totalProposalValues,
    totalProposedValues: totalProposalProposedValues,
    totalBenefitValues: totalProposalBenefitValues,
  } = await statProposals(chain);

  const {
    counts: bountiesCounts,
    proposers: bountyProposers,
    proposeCounts: bountiesProposedCounts,
    beneficiaries: bountyBeneficiaries,
    beneficiaryCounts: bountiesBeneficiaryCounts,
    totalFiatValues: totalBountyFiatValues,
    totalProposedFiatValues: totalBountyProposedFiatValues,
    totalBenefitFiatValues: totalBountyBenefitFiatValues,
    totalValues: totalBountyValues,
    totalProposedValues: totalBountyProposedValues,
    totalBenefitValues: totalBountyBenefitValues,
  } = await statBounties(chain);

  const {
    counts: childBountiesCounts,
    proposers: childBountyProposers,
    proposeCounts: childBountyProposeCounts,
    beneficiaries: childBountyBeneficiaries,
    beneficiaryCounts: childBountyBeneficiaryCounts,
    totalFiatValues: totalChildBountyFiatValues,
    totalProposedFiatValues: totalChildBountyProposedFiatValues,
    totalBenefitFiatValues: totalChildBountyBenefitFiatValues,
    totalValues: totalChildBountyValues,
    totalProposedValues: totalChildBountyProposedValues,
    totalBenefitValues: totalChildBountyBenefitValues,
  } = await statChildBounties(chain);

  const { councilors } = await statCouncilors(chain);

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
    const totalTipFiatValue = totalTipFiatValues[address] ?? 0;
    const totalTipProposedFiatValue = totalTipProposedFiatValues[address] ?? 0;
    const totalTipBenefitFiatValue = totalTipBenefitFiatValues[address] ?? 0;
    const totalTipValue = totalTipValues[address] ?? 0;
    const totalTipProposedValue = totalTipProposedValues[address] ?? 0;
    const totalTipBenefitValue = totalTipBenefitValues[address] ?? 0;

    const proposalsCount = proposalsCounts[address] ?? 0;
    const proposalsProposeCount = proposalsProposeCounts[address] ?? 0;
    const proposalsBeneficiaryCount = proposalsBeneficiaryCounts[address] ?? 0;
    const totalProposalFiatValue = totalProposalFiatValues[address] ?? 0;
    const totalProposalProposedFiatValue =
      totalProposalProposedFiatValues[address] ?? 0;
    const totalProposalBenefitFiatValue =
      totalProposalBenefitFiatValues[address] ?? 0;
    const totalProposalValue = totalProposalValues[address] ?? 0;
    const totalProposalProposedValue =
      totalProposalProposedValues[address] ?? 0;
    const totalProposalBenefitValue = totalProposalBenefitValues[address] ?? 0;

    const bountiesCount = bountiesCounts[address] ?? 0;
    const bountiesProposedCount = bountiesProposedCounts[address] ?? 0;
    const bountiesBeneficiaryCount = bountiesBeneficiaryCounts[address] ?? 0;
    const totalBountyFiatValue = totalBountyFiatValues[address] ?? 0;
    const totalBountyProposedFiatValue =
      totalBountyProposedFiatValues[address] ?? 0;
    const totalBountyBenefitFiatValue =
      totalBountyBenefitFiatValues[address] ?? 0;
    const totalBountyValue = totalBountyValues[address] ?? 0;
    const totalBountyProposedValue = totalBountyProposedValues[address] ?? 0;
    const totalBountyBenefitValue = totalBountyBenefitValues[address] ?? 0;

    const childBountiesCount = childBountiesCounts[address] ?? 0;
    const childBountyProposeCount = childBountyProposeCounts[address] ?? 0;
    const childBountyBeneficiaryCount =
      childBountyBeneficiaryCounts[address] ?? 0;
    const totalChildBountyFiatValue = totalChildBountyFiatValues[address] ?? 0;
    const totalChildBountyProposedFiatValue =
      totalChildBountyProposedFiatValues[address] ?? 0;
    const totalChildBountyBenefitFiatValue =
      totalChildBountyBenefitFiatValues[address] ?? 0;
    const totalChildBountyValue = totalChildBountyValues[address] ?? 0;
    const totalChildBountyProposedValue =
      totalChildBountyProposedValues[address] ?? 0;
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

    await saveParticipant(chain, address, {
      tips: {
        count: tipsCount,
        proposedCount: tipsProposeCount,
        benefitCount: tipsBeneficiaryCount,
        value: totalTipValue,
        proposedValue: totalTipProposedValue,
        benefitValue: totalTipBenefitValue,
        fiatValue: totalTipFiatValue,
        proposedFiatValue: totalTipProposedFiatValue,
        benefitFiatValue: totalTipBenefitFiatValue,
      },
      proposals: {
        count: proposalsCount,
        proposedCount: proposalsProposeCount,
        benefitCount: proposalsBeneficiaryCount,
        value: totalProposalValue,
        proposedValue: totalProposalProposedValue,
        benefitValue: totalProposalBenefitValue,
        fiatValue: totalProposalFiatValue,
        proposedFiatValue: totalProposalProposedFiatValue,
        benefitFiatValue: totalProposalBenefitFiatValue,
      },
      bounties: {
        count: bountiesCount,
        proposedCount: bountiesProposedCount,
        benefitCount: bountiesBeneficiaryCount,
        value: totalBountyValue,
        proposedValue: totalBountyProposedValue,
        benefitValue: totalBountyBenefitValue,
        fiatValue: totalBountyFiatValue,
        proposedFiatValue: totalBountyProposedFiatValue,
        benefitFiatValue: totalBountyBenefitFiatValue,
      },
      childBounties: {
        count: childBountiesCount,
        proposedCount: childBountyProposeCount,
        benefitCount: childBountyBeneficiaryCount,
        value: totalChildBountyValue,
        proposedValue: totalChildBountyProposedValue,
        benefitValue: totalChildBountyBenefitValue,
        fiatValue: totalChildBountyFiatValue,
        proposedFiatValue: totalChildBountyProposedFiatValue,
        benefitFiatValue: totalChildBountyBenefitFiatValue,
      },
      totalValue: {
        total: new BigNumber(totalTipValue)
          .plus(totalProposalValue)
          .plus(totalBountyValue)
          .plus(totalChildBountyValue)
          .toString(),
        totalProposed: new BigNumber(totalTipProposedValue)
          .plus(totalProposalProposedValue)
          .plus(totalBountyProposedValue)
          .plus(totalChildBountyProposedValue)
          .toString(),

        totalBenefit: new BigNumber(totalTipBenefitValue)
          .plus(totalProposalBenefitValue)
          .plus(totalBountyBenefitValue)
          .plus(totalChildBountyBenefitValue)
          .toString(),
      },
      totalFiatValue: {
        total:
          totalTipFiatValue +
          totalProposalFiatValue +
          totalBountyFiatValue +
          totalChildBountyFiatValue,

        totalProposed:
          totalTipProposedFiatValue +
          totalProposalProposedFiatValue +
          totalBountyProposedFiatValue +
          totalChildBountyProposedFiatValue,

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

async function main() {
  await updateParticipants("kusama");
  await updateParticipants("polkadot");
}

module.exports = main;
