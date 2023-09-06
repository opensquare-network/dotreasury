const isEmpty = require("lodash.isempty");
const { getReferendaReferendumCol, getReferendaReferendumTimelineCol } = require("../index");

async function insertReferendaReferendum(referendumObj) {
  const col = await getReferendaReferendumCol();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

async function updateReferendaReferendum(referendumIndex, updates = {}) {
  if (isEmpty(updates)) {
    return
  }

  const col = await getReferendaReferendumCol();
  await col.updateOne({
    referendumIndex,
    isFinal: false,
  }, {
    $set: updates,
  });
}

async function insertReferendaReferendumTimeline(item = {}) {
  const col = await getReferendaReferendumCol();
  const { referendumIndex } = item;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (!maybeInDb) {
    // we don't have to insert timeline item for non-treasury referendum. Only treasury referendum is saved in DB.
    return;
  }

  const timelineCol = await getReferendaReferendumTimelineCol();
  await timelineCol.insertOne(item);
}

async function getUnFinalReferenda() {
  const col = await getReferendaReferendumCol();
  return await col.find({  isFinal: false }).toArray();
}

module.exports = {
  insertReferendaReferendum,
  updateReferendaReferendum,
  insertReferendaReferendumTimeline,
  getUnFinalReferenda,
}
