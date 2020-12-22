const { getApi } = require("../api");
const { getBlockCollection } = require("../mongo");
const { getEventCollection } = require("../mongo");
const { getExtrinsicCollection } = require("../mongo");
const { getTipCollection } = require("../mongo");
const { getTipStateCollection } = require("../mongo");
const { getBountyCollection } = require("../mongo");
const { getBountyStateCollection } = require("../mongo");
const { getProposalCollection } = require("../mongo");
const { getProposalStateCollection } = require("../mongo");

async function findNonForkHeight(nowHeight) {
  const api = await getApi();

  let trialHeight = nowHeight;
  let blockInDb = null;
  let chainHash = null;

  do {
    trialHeight -= 1;
    const blockCol = await getBlockCollection();
    blockInDb = await blockCol.findOne({ "header.number": trialHeight });
    chainHash = await api.rpc.chain.getBlockHash(trialHeight);
  } while (blockInDb.hash !== chainHash.toString());

  return trialHeight;
}

async function deleteDataFrom(blockHeight) {
  const blockCol = await getBlockCollection();
  await blockCol.deleteMany({ "header.number": { $gte: blockHeight } });

  await deleteExtrinsicsFrom(blockHeight);
  await deleteEventsFrom(blockHeight);
  await deleteTipFrom(blockHeight);
  await deleteTipStateFrom(blockHeight);
  await deleteBountyFrom(blockHeight);
  await deleteBountyStateFrom(blockHeight);
  await deleteProposalFrom(blockHeight);
  await deleteProposalStateFrom(blockHeight);
}

async function deleteExtrinsicsFrom(blockHeight) {
  const col = await getExtrinsicCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteEventsFrom(blockHeight) {
  const col = await getEventCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteTipFrom(blockHeight) {
  const col = await getTipCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteTipStateFrom(blockHeight) {
  const col = await getTipStateCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteBountyFrom(blockHeight) {
  const col = await getBountyCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteBountyStateFrom(blockHeight) {
  const col = await getBountyStateCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteProposalFrom(blockHeight) {
  const col = await getProposalCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteProposalStateFrom(blockHeight) {
  const col = await getProposalStateCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

module.exports = {
  findNonForkHeight,
  deleteDataFrom,
};
