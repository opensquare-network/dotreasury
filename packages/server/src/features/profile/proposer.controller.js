const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getChildBountyCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getProposerCounts(ctx) {
  const { address } = ctx.params;

  const tipCol = await getTipCollection();
  const tipsCount = await tipCol.countDocuments({ finder: address });

  const proposalCol = await getProposalCollection();
  const proposalsCount = await proposalCol.countDocuments({
    proposer: address,
  });

  const bountyCol = await getBountyCollection();
  const bountiesCount = await bountyCol.countDocuments({
    "meta.proposer": address,
  });

  const childBountyCol = await getChildBountyCollection();
  const childBountiesCount = await childBountyCol.countDocuments({
    proposer: address,
  });

  ctx.body = {
    tipsCount,
    proposalsCount,
    bountiesCount,
    childBountiesCount,
  };
}

async function getProposerTips(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { finder: address };
  const tipCol = await getTipCollection();
  const total = await tipCol.countDocuments(q);
  const items = await tipCol
    .find(q, { projection: { timeline: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getProposerProposals(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { proposer: address };
  const proposalCol = await getProposalCollection();
  const total = await proposalCol.countDocuments(q);
  const items = await proposalCol
    .find(q, { projection: { timeline: 0, motions: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getProposerBounties(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.proposer": address };
  const bountyCol = await getBountyCollection();
  const total = await bountyCol.countDocuments(q);
  const items = await bountyCol
    .find(q, { projection: { timeline: 0, motions: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getProposerChildBounties(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { proposer: address };
  const childBountyCol = await getChildBountyCollection();
  const total = await childBountyCol.countDocuments(q);
  const items = await childBountyCol
    .find(q)
    .sort({ "indexer.blockHeight": -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getProposerCounts,
  getProposerTips,
  getProposerProposals,
  getProposerBounties,
  getProposerChildBounties,
};
