const { getTermsCollection, getTermCouncilorCollection } = require("./index");

async function upsertTerm(indexer, data) {
  const col = await getTermsCollection();
  await col.update(
    { 'indexer.blockHeight': indexer.blockHeight },
    {
      "$set": {
        indexer,
        ...data,
      }
    },
    { upsert: true },
  )
}

async function batchUpsertTermCouncilor(blockHeight, members = []) {
  const col = await getTermCouncilorCollection();
  if (members.length <= 0) {
    return
  }

  const bulk = col.initializeUnorderedBulkOp();
  for (const { address, balance } of members) {
    bulk.find({
      blockHeight,
      address,
    }).upsert().updateOne({
      $set: {
        balance,
      },
    });
  }

  await bulk.execute();
}

module.exports = {
  upsertTerm,
  batchUpsertTermCouncilor,
}
