const { getProposalCollection } = require("../mongo");
const { getLinkCollection, getDescriptionCollection } = require("../mongo-admin");

const migrateLink = async (chain) => {
  try {
    console.log(`${chain} link migration start`);
    const proposalCol = await getProposalCollection(chain);
    const linkCol = await getLinkCollection();
    const proposalLinks = await linkCol
      .find({
        "indexer.chain": chain,
        "indexer.type": "proposal",
      })
      .toArray();
    await Promise.all(
      proposalLinks.map(async (item) => {
        await proposalCol.updateOne(
          {
            proposalIndex: item.indexer.index,
          },
          {
            $set: { links: item.links },
          }
        );
      })
    );
    console.log(`${chain} link migration success`);
  } catch (err) {
    console.log(`${chain} link migration error`, err);
  }
};

const migrateDescription = async (chain) => {
  try {
    console.log(`${chain} description migration start`);
    const proposalCol = await getProposalCollection(chain);
    const descriptionCol = await getDescriptionCollection();
    const descriptions = await descriptionCol
      .find({
        "indexer.chain": chain,
        "indexer.type": "proposal",
      })
      .toArray();
    await Promise.all(
      descriptions.map(async (item) => {
        await proposalCol.updateOne(
          {
            proposalIndex: item.indexer.index,
          },
          {
            $set: {
              description: item.description,
              tags: item.tags,
            },
          }
        );
      })
    );
    console.log(`${chain} description migration success`);
  } catch (err) {
    console.log(`${chain} description migration error`, err);
  }
};

(async () => {
  await migrateLink("kusama");
  await migrateLink("polkadot");
  await migrateDescription("kusama");
  await migrateDescription("polkadot");
  process.exit(0);
})();
