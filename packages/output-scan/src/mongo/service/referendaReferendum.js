const { getReferendaReferendumCol } = require("../index");

async function insertReferendaReferendum(referendumObj) {
  const col = await getReferendaReferendumCol();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

module.exports = {
  insertReferendaReferendum,
}
