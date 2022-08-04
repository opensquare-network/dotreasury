const { getDemocracyReferendumCollection } = require("../index");

async function insertReferendum(referendumObj) {
  const col = await getDemocracyReferendumCollection();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

module.exports = {
  insertDemocracyReferendum: insertReferendum,
};
