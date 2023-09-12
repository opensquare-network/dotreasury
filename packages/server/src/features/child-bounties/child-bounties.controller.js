const { extractPage } = require("../../utils");
const { getChildBountyCollection } = require("../../mongo");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");
const { ChildBountyQueryFieldsMap } = require("../common/query");
const { getRangeCondition } = require("../common/getRangeCondition");

function getCondition(ctx) {
  const { beneficiary, proposer, status } = ctx.request.query;

  const condition = {};
  if (beneficiary) {
    condition["beneficiary"] = beneficiary;
  }

  if (proposer) {
    condition["proposer"] = proposer;
  }

  if (status) {
    condition["state.state"] = { $in: status.split("||") };
  }

  const rangeCond = getRangeCondition(ctx);

  return { ...condition, ...rangeCond };
}

async function queryChildBounties(ctx, q = {}) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  let sortParams = {
    stateSort: 1,
    index: -1,
    "indexer.blockHeight": -1,
  };

  const { sort } = ctx.request.query;
  if (sort) {
    let [fieldName, sortDirection] = sort.split("_");
    fieldName = ChildBountyQueryFieldsMap[fieldName];
    if (!fieldName) {
      throw new HttpError(400, "Invalid sort field");
    }
    sortParams = {
      [fieldName]: sortDirection === "desc" ? -1 : 1,
      "indexer.blockHeight": -1,
    };
  }

  const col = await getChildBountyCollection();
  const bounties = await col
    .find(q, {
      projection: {
        _id: 0,
        timeline: 0,
      },
    })
    .sort(sortParams)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments(q);

  return {
    items: bounties,
    page,
    pageSize,
    total,
  };
}

class ChildBountiesController {
  async getBountyDetail(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    const col = await getChildBountyCollection();
    const bounty = await col.findOne({ index: bountyIndex });

    if (!bounty) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      ...bounty,
    };
  }

  async getBountiesByParent(ctx) {
    const { bountyIndex } = ctx.params;
    const parentBountyId = parseInt(bountyIndex);
    if (isNaN(parentBountyId)) {
      ctx.status = 400;
      return;
    }

    ctx.body = await queryChildBounties(ctx, {
      parentBountyId: parseInt(bountyIndex),
    });
  }

  async getBounties(ctx) {
    const condition = getCondition(ctx);
    ctx.body = await queryChildBounties(ctx, condition);
  }

  // Links API
  async getBountyLinks(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain: process.env.CHAIN,
        type: "child-bounty",
        index: bountyIndex,
      },
    });
  }

  async createBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain: process.env.CHAIN,
          type: "child-bounty",
          index: bountyIndex,
        },
        link,
        description,
      },
      ctx.request.headers.signature,
    );
  }

  async deleteBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain: process.env.CHAIN,
          type: "child-bounty",
          index: bountyIndex,
        },
        linkIndex,
      },
      ctx.request.headers.signature,
    );
  }

  // Comments API
  async getBountyComments(ctx) {
    const { page, pageSize } = extractPage(ctx);
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await commentService.getComments(
      {
        chain: process.env.CHAIN,
        type: "child-bounty",
        index: bountyIndex,
      },
      page,
      pageSize,
    );
  }
}

module.exports = new ChildBountiesController();
