const { getProposalCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

class ProposalsController {
  async getProposals(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const { status } = ctx.request.query;
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const condition = {};
    if (status) {
      condition["state.name"] = status;
    }
    const proposalCol = await getProposalCollection(chain);

    const total = proposalCol.countDocuments(condition);
    const list = proposalCol
      .find(condition, { timeline: 0 })
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const result = await Promise.all([total, list]);

    ctx.body = {
      items: result[1].map((item) => ({
        indexer: item.indexer,
        proposalIndex: item.proposalIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        proposer: item.proposer,
        value: item.value,
        symbolPrice: item.symbolPrice,
        beneficiary: item.beneficiary,
        links: item.links || [],
        latestState: {
          state: item.state?.name,
          time: (
            item.state?.eventIndexer ||
            item.state?.eventIndexer ||
            item.state?.indexer
          ).blockTime,
        },
      })),
      page,
      pageSize,
      total: result[0],
    };
  }

  async getProposalDetail(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    const proposalCol = await getProposalCollection(chain);
    const proposal = await proposalCol.findOne({ proposalIndex });

    const motionCol = await getMotionCollection(chain);
    const proposalMotions = await motionCol
      .find({ treasuryProposalId: proposalIndex })
      .sort({ index: 1 })
      .toArray();

    if (!proposal) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      indexer: proposal.indexer,
      proposalIndex: proposal.proposalIndex,
      proposeTime: proposal.indexer.blockTime,
      proposeAtBlockHeight: proposal.indexer.blockHeight,
      proposer: proposal.proposer,
      value: proposal.value,
      symbolPrice: proposal.symbolPrice,
      beneficiary: proposal.beneficiary,
      latestState: proposal.state,
      motions: proposalMotions,
      timeline: proposal.timeline,
    };
  }

  async getProposalSummary(ctx) {
    const { chain } = ctx.params;
    const proposalCol = await getProposalCollection(chain);
    const total = await proposalCol.estimatedDocumentCount();
    const countByStates = await proposalCol
      .aggregate([
        {
          $group: {
            _id: "$state.name",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = { total };
    countByStates.forEach((item) => (result[item._id] = item.count));

    ctx.body = result;
  }

  async getProposalLinks(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain,
        type: "proposal",
        index: proposalIndex,
      },
    });
  }

  async createProposalLink(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain,
          type: "proposal",
          index: proposalIndex,
        },
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteProposalLink(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain,
          type: "proposal",
          index: proposalIndex,
        },
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  // Comments API
  async getProposalComments(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await commentService.getComments(
      {
        chain,
        type: "proposal",
        index: proposalIndex,
      },
      page,
      pageSize,
      ctx.request.user
    );
  }

  async postProposalComment(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const proposalCol = await getProposalCollection(chain);
    const proposal = await proposalCol.findOne({ proposalIndex });
    if (!proposal) {
      throw new HttpError(404, "Proposal not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain,
        type: "proposal",
        index: proposalIndex,
      },
      content,
      user
    );
  }
}

module.exports = new ProposalsController();
