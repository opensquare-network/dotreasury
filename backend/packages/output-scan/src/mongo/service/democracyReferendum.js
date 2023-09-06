const { getDemocracyReferendumCollection } = require("../index");
const isEmpty = require("lodash.isempty");

async function insertReferendum(referendumObj) {
  const col = await getDemocracyReferendumCollection();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

async function updateReferendumByIndex(referendumIndex, updates, timelineItem) {
  let update = isEmpty(updates) ? null : { $set: updates };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (isEmpty(update)) {
    return;
  }

  const col = await getDemocracyReferendumCollection();
  await col.updateOne({ referendumIndex }, update);
}

async function updateReferendumWithTreasuryProposal(referendumIndex, treasuryProposal) {
  const update = {
    $push: { treasuryProposals: treasuryProposal },
  }

  const col = await getDemocracyReferendumCollection();
  await col.updateOne({ referendumIndex }, update);
}

async function getReferendum(referendumIndex) {
  const col = await getDemocracyReferendumCollection();
  return await col.findOne({ referendumIndex });
}

module.exports = {
  insertDemocracyReferendum: insertReferendum,
  updateReferendumByIndex,
  updateReferendumWithTreasuryProposal,
  getReferendum,
};
