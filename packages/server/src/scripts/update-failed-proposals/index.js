const dotenv = require("dotenv");
dotenv.config();

const { getFailedProposalCollection } = require("../../mongo");

const getFailedProposalData = () => {
  const chain = process.env.CHAIN;
  if (chain === "kusama") {
    return require("./kusama.json");
  } else if (chain === "polkadot") {
    return require("./polkadot.json");
  } else if (chain === "centrifuge") {
    return require("./centrifuge.json");
  } else {
    throw new Error("Invalid chain");
  }
};

async function main() {
  const failedProposalCol = await getFailedProposalCollection();
  await failedProposalCol.deleteMany({});

  const failedProposals = getFailedProposalData();

  const bulk = failedProposalCol.initializeUnorderedBulkOp();
  for (const proposal of failedProposals) {
    console.log(`Updating proposal ${proposal.proposalIndex}`);
    bulk
      .find({ proposalIndex: proposal.proposalIndex })
      .upsert()
      .updateOne({
        $set: {
          reason: proposal.reason,
        },
      });
  }
  await bulk.execute();
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
