const { extractPage } = require("../../utils");
const { getChildBountyCollection } = require("../../mongo");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

function getCondition(ctx) {
  const { beneficiary, proposer } = ctx.request.query;

  const condition = {}
  if (beneficiary) {
    condition["beneficiary"] = beneficiary;
  }

  if (proposer) {
    condition["proposer"] = proposer;
  }

  return condition;
}

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
      stateSort: 1,
      index: -1,
      "indexer.blockHeight": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments(q);

  return {
    items: bounties,
    page,
    pageSize,
    total,
  }
}

class ChildBountiesController {
  async getBountyDetail(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    const col = await getChildBountyCollection(chain);
    const bounty = await col.findOne({ index: bountyIndex });

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

    const condition = getCondition(ctx);
    ctx.body = await queryChildBounties(ctx, chain, condition);
  }

  // Links API
  async getBountyLinks(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain,
        type: "child-bounty",
        index: bountyIndex,
      },
    });
  }

  async createBountyLink(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain,
          type: "child-bounty",
          index: bountyIndex,
        },
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteBountyLink(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain,
          type: "child-bounty",
          index: bountyIndex,
        },
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  // Comments API
  async getBountyComments(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await commentService.getComments(
      {
        chain,
        type: "child-bounty",
        index: bountyIndex,
      },
      page,
      pageSize,
    );
  }

  async postBountyComment(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const bountyCol = await getChildBountyCollection(chain);
    const bounty = await bountyCol.findOne({ index: bountyIndex });
    if (!bounty) {
      throw new HttpError(404, "Bounty not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain,
        type: "child-bounty",
        index: bountyIndex,
      },
      content,
      user
    );
  }
}

module.exports = new ChildBountiesController();
