const {
  getTermsCollection,
  getTermCouncilorCollection,
  getRenouncementCollection,
} = require("./index");

async function upsertTerm(indexer, members) {
  const col = await getTermsCollection();
  await col.updateOne(
    { 'indexer.blockHeight': indexer.blockHeight },
    {
      "$set": {
        indexer,
        members,
      }
    },
    { upsert: true },
  )
}

async function upsertRenouncement(blockHeight, addedMembers, removedMembers) {
  const col = await getRenouncementCollection();
  await col.updateOne(
    { blockHeight },
    {
      "$set": {
        addedMembers,
        removedMembers,
      }
    }
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
  upsertRenouncement,
}
