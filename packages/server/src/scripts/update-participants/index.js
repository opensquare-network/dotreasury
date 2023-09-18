const dotenv = require("dotenv");
dotenv.config();

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
    counts: tips,
    proposers: tipProposers,
    proposeCounts: tipProposeCounts,
    beneficiaries: tipBeneficiaries,
    beneficiaryCounts: tipBeneficiaryCounts,
  } = await statTips();

  const {
    counts: proposals,
    proposers: proposalProposers,
    proposeCounts: proposalProposeCounts,
    beneficiaries: proposalBeneficiaries,
    beneficiaryCounts: proposalBeneficiaryCounts,
  } = await statProposals();

  const {
    counts: bounties,
    proposers: bountyProposers,
    proposeCounts: bountyProposeCounts,
    beneficiaries: bountyBeneficiaries,
    beneficiaryCounts: bountyBeneficiaryCounts,
  } = await statBounties();

  const {
    counts: childBounties,
    proposers: childBountyProposers,
    proposeCounts: childBountyProposeCounts,
    beneficiaries: childBountyBeneficiaries,
    beneficiaryCounts: childBountyBeneficiaryCounts,
  } = await statChildBounties();

  const { councilors } = await statCouncilors();

  const participants = new Set([
    ...Object.keys(tips),
    ...Object.keys(proposals),
    ...Object.keys(bounties),
    ...Object.keys(childBounties),
    ...councilors,
  ]);

  for (const address of participants) {
    const tipsCount = tips[address] ?? 0;
    const tipProposeCount = tipProposeCounts[address] ?? 0;
    const tipBeneficiaryCount = tipBeneficiaryCounts[address] ?? 0;

    const proposalsCount = proposals[address] ?? 0;
    const proposalProposeCount = proposalProposeCounts[address] ?? 0;
    const proposalBeneficiaryCount = proposalBeneficiaryCounts[address] ?? 0;

    const bountiesCount = bounties[address] ?? 0;
    const bountyProposeCount = bountyProposeCounts[address] ?? 0;
    const bountyBeneficiaryCount = bountyBeneficiaryCounts[address] ?? 0;

    const childBountiesCount = childBounties[address] ?? 0;
    const childBountyProposeCount = childBountyProposeCounts[address] ?? 0;
    const childBountyBeneficiaryCount =
      childBountyBeneficiaryCounts[address] ?? 0;

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
      // tips
      tips: tipsCount,
      proposeTips: tipProposeCount,
      beneficiaryTips: tipBeneficiaryCount,
      // proposals
      proposals: proposalsCount,
      proposeProposals: proposalProposeCount,
      beneficiaryProposals: proposalBeneficiaryCount,
      // bounties
      bounties: bountiesCount,
      proposeBounties: bountyProposeCount,
      beneficiaryBounties: bountyBeneficiaryCount,
      // child bounties
      childBounties: childBountiesCount,
      proposeChildBounties: childBountyProposeCount,
      beneficiaryChildBounties: childBountyBeneficiaryCount,

      total: tipsCount + proposalsCount + bountiesCount + childBountiesCount,
      totalProposed:
        tipProposeCount +
        proposalProposeCount +
        bountyProposeCount +
        childBountyProposeCount,
      totalBenefit:
        tipBeneficiaryCount +
        proposalBeneficiaryCount +
        bountyBeneficiaryCount +
        childBountyBeneficiaryCount,
      isProposer,
      isBeneficiary,
      isCouncilor,
    });
  }
}

async function main() {
  await updateParticipants();
}

module.exports = main;
