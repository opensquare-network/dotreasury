const { extractPage } = require("../../utils");
const { getChildBountyCollection } = require("../../mongo");

async function queryChildBounties(ctx, chain, q = {}) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getChildBountyCollection(chain);
  const bounties = await col
    .find(q, {
      projection: {
        _id: 0,
        timeline: 0,
      }
    })
    .sort({
      "indexer.blockHeight": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.estimatedDocumentCount();

  return {
    items: bounties,
    page,
    pageSize,
    total,
  }
}

class ChildBountiesController {
  async getChildBounty(ctx) {
    const { chain } = ctx.params;
    const index = parseInt(ctx.params.index);

    const col = await getChildBountyCollection(chain);
    const bounty = await col.findOne({ index });

    if (!bounty) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      ...bounty
    }
  }

  async getBountiesByParent(ctx) {
    const { chain, bountyIndex } = ctx.params;
    const parentBountyId = parseInt(bountyIndex);
    if (isNaN(parentBountyId)) {
      ctx.status = 400;
      return;
    }

    ctx.body = await queryChildBounties(ctx, chain, {
      parentBountyId: parseInt(bountyIndex),
    })
  }

  async getBounties(ctx) {
    const { chain } = ctx.params;
    ctx.body = await queryChildBounties(ctx, chain, {});
  }
}

module.exports = new ChildBountiesController();
