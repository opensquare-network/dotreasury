const dotenv = require("dotenv");
dotenv.config();

const { getParticipantCollection } = require("../../mongo");
const { statTips } = require("./statTips");
const { statProposals } = require("./statProposals");
const { statBounties } = require("./statBounties");
const { statChildBounties } = require("./statChildBounties");
const { statCouncilors } = require("./statCouncilors");

async function saveParticipant(chain, address, data) {
  const participantCol = await getParticipantCollection(chain);
  await participantCol.updateOne(
    { address },
    { $set: data },
    { upsert: true }
  );
}

async function updateParticipants(chain) {
  console.log(`Update participants of ${chain}`);

  const {
    counts: tips,
    proposers: tipProposers,
    beneficiaries: tipBeneficiaries
  } = await statTips(chain);
  const {
    counts: proposals,
    proposers: proposalProposers,
    beneficiaries: proposalBeneficiaries
  } = await statProposals(chain);
  const {
    counts: bounties,
    proposers: bountyProposers,
    beneficiaries: bountyBeneficiaries
  } = await statBounties(chain);
  const {
    counts: childBounties,
    proposers: childBountyProposers,
    beneficiaries: childBountyBeneficiaries
  } = await statChildBounties(chain);
  const { councilors } = await statCouncilors(chain);

  const participants = new Set([
    ...Object.keys(tips),
    ...Object.keys(proposals),
    ...Object.keys(bounties),
    ...Object.keys(childBounties),
    ...councilors,
  ]);

  for (const address of participants) {
    const tipsCount = tips[address] ?? 0;
    const proposalsCount = proposals[address] ?? 0;
    const bountiesCount = bounties[address] ?? 0;
    const childBountiesCount = childBounties[address] ?? 0;
    const isProposer = tipProposers.has(address) ||
      proposalProposers.has(address) ||
      bountyProposers.has(address) ||
      childBountyProposers.has(address);
    const isBeneficiary = tipBeneficiaries.has(address) ||
      proposalBeneficiaries.has(address) ||
      bountyBeneficiaries.has(address) ||
      childBountyBeneficiaries.has(address);
    const isCouncilor = councilors.has(address);

    await saveParticipant(chain, address, {
      tips: tipsCount,
      proposals: proposalsCount,
      bounties: bountiesCount,
      childBounties: childBountiesCount,
      total: tipsCount + proposalsCount + bountiesCount + childBountiesCount,
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
