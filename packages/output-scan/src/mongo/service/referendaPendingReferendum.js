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

async function findReferendaPendingReferendum(proposalHash) {
  const col = await getReferendaPendingReferendumCol();
  return await col.findOne({ proposalHash });
}

async function deleteReferendaPendingReferendum(proposalHash) {
  const col = await getReferendaPendingReferendumCol();
  await col.deleteOne({ proposalHash });
}

module.exports = {
  insertReferendaPendingReferendum,
  findReferendaPendingReferendum,
  deleteReferendaPendingReferendum,
}
