const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getProposerCounts(ctx) {
  const { chain, address } = ctx.params;

  const tipCol = await getTipCollection(chain);
  const tipsCount = await tipCol.countDocuments({ finder: address });

  const proposalCol = await getProposalCollection(chain);
  const proposalsCount = await proposalCol.countDocuments({ proposer: address });

  const bountyCol = await getBountyCollection(chain);
  const bountiesCount = await bountyCol.countDocuments({ "meta.proposer": address });

  ctx.body = {
    tipsCount,
    proposalsCount,
    bountiesCount,
  };
}

async function getProposerTips(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { finder: address };
  const tipCol = await getTipCollection(chain);
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
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { proposer: address };
  const proposalCol = await getProposalCollection(chain);
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
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.proposer": address };
  const bountyCol = await getBountyCollection(chain);
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

module.exports = {
  getProposerCounts,
  getProposerTips,
  getProposerProposals,
  getProposerBounties,
};
