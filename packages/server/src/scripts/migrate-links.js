const dotenv = require("dotenv");
dotenv.config();

const { getProposalCollection } = require("../mongo");
const {
  getLinkCollection,
  getDescriptionCollection,
} = require("../mongo-admin");

const migrateLink = async () => {
  const chain = process.env.CHAIN;

  try {
    console.log(`${chain} link migration start`);
    const proposalCol = await getProposalCollection();
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
          },
        );
      }),
    );
    console.log(`${chain} link migration success`);
  } catch (err) {
    console.log(`${chain} link migration error`, err);
  }
};

const migrateDescription = async () => {
  const chain = process.env.CHAIN;

  try {
    console.log(`${chain} description migration start`);
    const proposalCol = await getProposalCollection();
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
          },
        );
      }),
    );
    console.log(`${chain} description migration success`);
  } catch (err) {
    console.log(`${chain} description migration error`, err);
  }
};

async function main() {
  await migrateLink();
  await migrateDescription();
}

module.exports = main;
