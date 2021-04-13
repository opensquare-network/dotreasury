const { getProposalCollection } = require("../mongo");
const { getLinkCollection } = require("../mongo-admin");

const migrate = async (chain) => {
  try {
    console.log(`${chain} migration start`);
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
    console.log(`${chain} migration success`);
  } catch (err) {
    console.log(`${chain} migration error`, err);
  }
};

(async () => {
  await migrate("kusama");
  await migrate("polkadot");
  process.exit(0);
})();
