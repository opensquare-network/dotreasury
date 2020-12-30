const { getBlockCollection } = require("../mongo");
const { getExtrinsicCollection } = require("../mongo");
const { getTipCollection } = require("../mongo");
const { getBountyCollection } = require("../mongo");
const { getBountyTimelineCollection } = require("../mongo");
const { getProposalCollection } = require("../mongo");
const { getProposalTimelineCollection } = require("../mongo");
const { getCouncilProposalCollection } = require("../mongo");

async function deleteDataFrom(blockHeight) {
  const blockCol = await getBlockCollection();
  await blockCol.deleteMany({ "header.number": { $gte: blockHeight } });

  await deleteTipFrom(blockHeight);
  await deleteBountyFrom(blockHeight);
  await deleteBountyTimelineFrom(blockHeight);
  await deleteProposalFrom(blockHeight);
  await deleteProposalTimelineFrom(blockHeight);
  await deleteCouncilProposalFrom(blockHeight);
}

async function deleteExtrinsicsFrom(blockHeight) {
  const col = await getExtrinsicCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteTipFrom(blockHeight) {
  const col = await getTipCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteBountyFrom(blockHeight) {
  const col = await getBountyCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteBountyTimelineFrom(blockHeight) {
  const col = await getBountyTimelineCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteProposalFrom(blockHeight) {
  const col = await getProposalCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteProposalTimelineFrom(blockHeight) {
  const col = await getProposalTimelineCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });
}

async function deleteCouncilProposalFrom(blockHeight) {
  let col = await getCouncilProposalCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: blockHeight } });

  col = await getTipCollection();
  await col.updateMany(
    {},
    {
      $pull: {
        councilProposals: {
          "indexer.blockHeight": { $gte: blockHeight },
        },
      },
    }
  );

  col = await getBountyCollection();
  await col.updateMany(
    {},
    {
      $pull: {
        councilProposals: {
          "indexer.blockHeight": { $gte: blockHeight },
        },
      },
    }
  );

  col = await getProposalCollection();
  await col.updateMany(
    {},
    {
      $pull: {
        councilProposals: {
          "indexer.blockHeight": { $gte: blockHeight },
        },
      },
    }
  );
}

module.exports = {
  deleteDataFrom,
};
