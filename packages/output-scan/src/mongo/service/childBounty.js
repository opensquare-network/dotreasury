const { getChildBountyCollection } = require("../index");
const isEmpty = require("lodash.isempty");

async function insertChildBounty(childBountyObj = {}) {
  const { index, parentBountyId } = childBountyObj;
  const col = await getChildBountyCollection();
  const maybeInDb = await col.findOne({ index, parentBountyId });
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

async function updateChildBountyWithParentId(parentBountyIndex, index, updates, timelineItem) {
  let update = isEmpty(updates) ? null : { $set: updates };
  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  const col = await getChildBountyCollection();
  await col.updateOne({ parentBountyId: parentBountyIndex, index }, update);
}

async function updateChildBountyTimeline(childBountyId, timelineItem) {
  const col = await getChildBountyCollection();
  const childBounty = await col.findOne({ index: childBountyId });
  if (!childBounty) {
    return;
  }

  const { indexer: { blockHeight } } = timelineItem || {};
  const timeline = childBounty.timeline || [];
  const awardedItemIndex = timeline.findIndex(item =>
    item.name === "Awarded" &&
    item.indexer.blockHeight === blockHeight
  );
  if (awardedItemIndex >= 0) {
    timeline.splice(awardedItemIndex, 0, timelineItem);
    await col.updateOne({ index: childBounty.index }, { $set: { timeline } });
  }
}

module.exports = {
  insertChildBounty,
  updateChildBounty,
  updateChildBountyTimeline,
  updateChildBountyWithParentId,
}
