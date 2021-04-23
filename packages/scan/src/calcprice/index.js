const dotenv = require("dotenv");
dotenv.config();

const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
} = require("../mongo");
const { getPrice } = require("./price");

async function savePrice(col) {
  const items = await col.find({}).toArray();

  for (const item of items) {
    if (item.symbolPrice !== undefined) {
      continue;
    }
    const blockTime = item.indexer?.blockTime;
    if (blockTime) {
      const price = await getPrice(blockTime);
      if (price) {
        await col.updateOne(
          { _id: item._id },
          {
            $set: {
              symbolPrice: price,
            },
          }
        );
      }
    }
  }
}

async function main() {
  if (!process.env.CHAIN) {
    console.error(`Environment CHAIN is not set.`);
    return;
  }

  if (!["polkadot", "kusama"].includes(process.env.CHAIN)) {
    console.error(`Unkown chain type`);
    return;
  }

  const tipCol = await getTipCollection();
  await savePrice(tipCol);

  const proposalCol = await getProposalCollection();
  await savePrice(proposalCol);

  const bountyCol = await getBountyCollection();
  await savePrice(bountyCol);

  process.exit(0);
}

main().catch(console.error);
