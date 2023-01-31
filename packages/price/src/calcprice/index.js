const dotenv = require("dotenv");
dotenv.config();

const DB = require("./output-scan");

const dotDbName = process.env.MONGO_DB_OUTPUT_DOT_NAME;
if (!dotDbName) {
  console.log("MONGO_DB_OUTPUT_DOT_NAME not set");
  process.exit(1);
}

const ksmDbName = process.env.MONGO_DB_OUTPUT_KSM_NAME;
if (!ksmDbName) {
  console.log("MONGO_DB_OUTPUT_KSM_NAME not set");
  process.exit(1);
}

const dbNames = {
  kusama: ksmDbName,
  polkadot: dotDbName,
};
const dbUrls = {
  kusama: process.env.KSM_MONGO_URL,
  polkadot: process.env.DOT_MONGO_URL,
}

const { getPrice } = require("./price");

async function savePrice(chain, col) {
  const items = await col.find({}).toArray();

  for (const item of items) {
    if (item.symbolPrice !== undefined) {
      continue;
    }
    const blockTime = item.indexer?.blockTime;
    if (blockTime) {
      const price = await getPrice(chain, blockTime);
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
  for (const chain of ["kusama", "polkadot"]) {
    const dbUrl = dbUrls[chain];
    const dbName = dbNames[chain];
    const {
      getTipCollection,
      getProposalCollection,
      getBountyCollection,
      getChildBountyCollection,
      getReferendaReferendumCollection,
    } = DB(dbUrl, dbName);

    const tipCol = await getTipCollection();
    await savePrice(chain, tipCol);

    const proposalCol = await getProposalCollection();
    await savePrice(chain, proposalCol);

    const bountyCol = await getBountyCollection();
    await savePrice(chain, bountyCol);

    const childBountyCol = await getChildBountyCollection();
    await savePrice(chain, childBountyCol);

    if (chain === "kusama") {
      const referendaCol = await getReferendaReferendumCollection();
      await savePrice(chain, referendaCol);
    }

    console.log("Update price successful:", dbName);
  }

  process.exit(0);
}

main().catch(console.error);
