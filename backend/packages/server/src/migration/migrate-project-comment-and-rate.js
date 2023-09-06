const dotenv = require("dotenv");
dotenv.config();

const { getCommentCollection, getRateCollection } = require("../mongo-admin");

async function migrateProjectRates() {
  const rateCol = await getRateCollection();
  const rates = await rateCol.find({ "indexer.type": "project" }).toArray();
  for (const rate of rates) {
    await rateCol.updateOne(
      { _id: rate._id },
      {
        $unset: { "indexer.chain": true }
      }
    );
  }
}

async function migrateProjectComments() {
  const commentCol = await getCommentCollection();
  const comments = await commentCol.find({ "indexer.type": "project" }).toArray();
  for (const comment of comments) {
    await commentCol.updateOne(
      { _id: comment._id },
      {
        $unset: { "indexer.chain": true }
      }
    );
  }
}

async function main() {
  await migrateProjectRates();
  await migrateProjectComments();
}

main().finally(() => process.exit());
