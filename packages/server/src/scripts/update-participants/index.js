const dotenv = require("dotenv");
dotenv.config();

const { getParticipantCollection } = require("../../mongo");
const { statTips } = require("./statTips");
const { statProposals } = require("./statProposals");
const { statBounties } = require("./statBounties");
const { statChildBounties } = require("./statChildBounties");

async function saveParticipant(chain, address, data) {
  const participantCol = await getParticipantCollection(chain);
  await participantCol.updateOne(
    { address },
    { $set: data },
    { upsert: true }
  );
}

async function updateParticipants(chain) {
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
  const { counts: childBounties } = await statChildBounties(chain);

  const participants = new Set([
    ...Object.keys(tips),
    ...Object.keys(proposals),
    ...Object.keys(bounties),
    ...Object.keys(childBounties),
  ]);

  for (const address of participants) {
    const tipsCount = tips[address] ?? 0;
    const proposalsCount = proposals[address] ?? 0;
    const bountiesCount = bounties[address] ?? 0;
    const childBountiesCount = childBounties[address] ?? 0;
    const isProposer = tipProposers.has(address) || proposalProposers.has(address) || bountyProposers.has(address);
    const isBeneficiary = tipBeneficiaries.has(address) || proposalBeneficiaries.has(address) || bountyBeneficiaries.has(address);

    await saveParticipant(chain, address, {
      tips: tipsCount,
      proposals: proposalsCount,
      bounties: bountiesCount,
      childBounties: childBountiesCount,
      total: tipsCount + proposalsCount + bountiesCount + childBountiesCount,
      isProposer,
      isBeneficiary,
    });
  }
}

async function main() {
  await updateParticipants("kusama");
  await updateParticipants("polkadot");
}

main()
  .catch(console.error)
  .finally(() => process.exit());

