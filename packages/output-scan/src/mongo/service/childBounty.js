const { getChildBountyCollection } = require("../index");

async function insertChildBounty(childBountyObj = {}) {
  const { index } = childBountyObj;
  const col = await getChildBountyCollection();
  const maybeInDb = await col.findOne({ index });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(childBountyObj);
}

async function updateChildBounty(index, updates, timelineItem) {
  let update = isEmpty(updates) ? null : { $set: updates };
  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  const col = await getChildBountyCollection();
  await col.updateOne({ index }, update);
}

module.exports = {
  insertChildBounty,
  updateChildBounty,
}
