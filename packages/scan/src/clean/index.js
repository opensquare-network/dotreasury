const { getTipCollection } = require("../mongo");
const { getBountyCollection } = require("../mongo");
const { getProposalCollection } = require("../mongo");

async function deleteDataFrom(blockHeight) {
  await deleteTipFrom(blockHeight);
  await deleteBountyFrom(blockHeight);
  await deleteProposalFrom(blockHeight);
}

async function deleteTipFrom(blockHeight) {
  const col = await getTipCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteBountyFrom(blockHeight) {
  const col = await getBountyCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteProposalFrom(blockHeight) {
  const col = await getProposalCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

module.exports = {
  deleteDataFrom,
};
