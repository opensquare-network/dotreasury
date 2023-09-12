const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getChildBountyCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getBeneficiaryCounts(ctx) {
  const { address } = ctx.params;

  const tipCol = await getTipCollection();
  const tipsCount = await tipCol.countDocuments({ "meta.who": address });

  const proposalCol = await getProposalCollection();
  const proposalsCount = await proposalCol.countDocuments({
    beneficiary: address,
  });

  const bountyCol = await getBountyCollection();
  const bountiesCount = await bountyCol.countDocuments({
    "meta.status.pendingPayout.beneficiary": address,
  });

  const childBountyCol = await getChildBountyCollection();
  const childBountiesCount = await childBountyCol.countDocuments({
    beneficiary: address,
  });

  ctx.body = {
    tipsCount,
    proposalsCount,
    bountiesCount,
    childBountiesCount,
  };
}

async function getBeneficiaryTips(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.who": address };
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

async function getBeneficiaryProposals(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { beneficiary: address };
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

async function getBeneficiaryBounties(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { "meta.status.pendingPayout.beneficiary": address };
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

async function getBeneficiaryChildBounties(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { beneficiary: address };
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
  getBeneficiaryCounts,
  getBeneficiaryTips,
  getBeneficiaryProposals,
  getBeneficiaryBounties,
  getBeneficiaryChildBounties,
};
