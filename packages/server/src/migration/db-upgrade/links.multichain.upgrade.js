const { getLinkCollection } = require("../../mongo-admin");

const main = async () => {
  try {
    console.log("Upgrade start");
    const linkCol = await getLinkCollection();
    const links = await linkCol.find({}).toArray();
    for (const linkItem of links) {
      if (linkItem.type && linkItem.indexer !== undefined) {
        await linkCol.updateOne(
          {
            _id: linkItem._id,
          },
          {
            $set: {
              indexer: {
                chain: "kusama",
                type:
                  linkItem.type === "tips"
                    ? "tip"
                    : linkItem.type === "proposals"
                    ? "proposal"
                    : linkItem.type === "bounties"
                    ? "bounty"
                    : linkItem.type,
                index: linkItem.indexer,
              },
            },
            $unset: {
              type: true,
            },
          }
        );
      }
    }
    console.log("Upgrade success");
    process.exit(0);
  } catch (err) {
    console.log("Upgrade error", err);
    process.exit(1);
  }
};

main();
