const { getProposalCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

class ProposalsController {
  async getProposals(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const proposalCol = await getProposalCollection();
    const proposals = await proposalCol
      .find({}, { timeline: 0 })
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await proposalCol.estimatedDocumentCount();

    ctx.body = {
      items: proposals.map((item) => ({
        indexer: item.indexer,
        proposalIndex: item.proposalIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        proposer: item.proposer,
        value: item.value,
        beneficiary: item.beneficiary,
        links: item.links || [],
        latestState: {
          state: item.state?.name,
          time: item.state?.indexer.blockTime,
        },
      })),
      page,
      pageSize,
      total,
    };
  }

  async getProposalsCount(ctx) {
    const proposalCol = await getProposalCollection();
    const proposalsCount = await proposalCol.estimatedDocumentCount();
    ctx.body = proposalsCount;
  }

  async getProposalDetail(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    const proposalCol = await getProposalCollection();
    const proposal = await proposalCol.findOne({ proposalIndex });

    const motionCol = await getMotionCollection();
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
      beneficiary: proposal.beneficiary,
      latestState: {
        state: proposal.state?.name,
        time: proposal.state?.indexer.blockTime,
        indexer: proposal.state?.indexer,
        data: proposal.state?.data,
      },
      motions: proposalMotions,
    };
  }

  async getProposalSummary(ctx) {
    const proposalCol = await getProposalCollection();
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
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await linkService.getLinks({
      type: "proposals",
      indexer: proposalIndex,
    });
  }

  async createProposalLink(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        type: "proposals",
        indexer: proposalIndex,
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteProposalLink(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        type: "proposals",
        indexer: proposalIndex,
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  // Comments API
  async getProposalComments(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await commentService.getComments({
      treasuryProposalId: proposalIndex,
    });
  }

  async postProposalComment(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const proposalCol = await getProposalCollection();
    const proposal = await proposalCol.findOne({ proposalIndex });
    if (!proposal) {
      throw new HttpError(404, "Proposal not found");
    }

    ctx.body = await commentService.postComment(
      { treasuryProposalId: proposalIndex },
      content,
      user
    );
  }
}

module.exports = new ProposalsController();
