const { getReferendaPendingReferendumCol } = require("../index");

async function insertReferendaPendingReferendum(referendumObj) {
  const col = await getReferendaPendingReferendumCol();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

module.exports = {
  insertReferendaPendingReferendum,
}
