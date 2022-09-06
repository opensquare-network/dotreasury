const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getBeneficiaryCounts(ctx) {
  const { chain, address } = ctx.params;

  const tipCol = await getTipCollection(chain);
  const tipsCount = await tipCol.countDocuments({ "meta.who": address });

  const proposalCol = await getProposalCollection(chain);
  const proposalsCount = await proposalCol.countDocuments({ beneficiary: address });

  const bountyCol = await getBountyCollection(chain);
  const bountiesCount = await bountyCol.countDocuments({ "meta.status.pendingPayout.beneficiary": address });

  ctx.body = {
    tipsCount,
    proposalsCount,
    bountiesCount,
  };
}

async function getBeneficiaryTips(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.who": address };
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

async function getBeneficiaryProposals(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { beneficiary: address };
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

async function getBeneficiaryBounties(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.status.pendingPayout.beneficiary": address };
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
  getBeneficiaryCounts,
  getBeneficiaryTips,
  getBeneficiaryProposals,
  getBeneficiaryBounties,
};
