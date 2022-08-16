const {
  getProposalCollection,
  getMotionCollection,
  getReferendumCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const rateService = require("../../services/rate.service");
const descriptionService = require("../../services/description.service");
const { HttpError } = require("../../exc");

async function getProposalMotions(proposal, chain) {
  const motionHashes = (proposal.motions || []).map(motionInfo => motionInfo.hash);

  const motionCol = await getMotionCollection(chain);
  const proposalMotions = await motionCol
    .find({
      hash: { $in: motionHashes }
    })
    .sort({ index: 1 })
    .toArray();

  const motions = (proposal.motions || []).map(motionInfo => {
    const targetMotion = (proposalMotions || []).find(
      m => m.hash === motionInfo.hash && m.indexer.blockHeight === motionInfo.indexer.blockHeight
    )

    return {
      motionInfo,
      ...targetMotion,
    }
  });

  return motions;
}

async function getProposalReferendums(proposal, chain) {
  const referendumIndexes = (proposal.referendums || []).map(referendumInfo => referendumInfo.referendumIndex);

  const referendumCol = await getReferendumCollection(chain);
  const proposalReferendums = await referendumCol
    .find({
      referendumIndex: { $in: referendumIndexes }
    })
    .sort({ referendumIndex: 1 })
    .toArray();

  const referendums = (proposal.referendums || []).map(referendumInfo => {
    const targetReferendum = (proposalReferendums || []).find(
      r => r.referendumIndex === referendumInfo.referendumIndex
    )

    return {
      referendumInfo,
      ...targetReferendum,
    }
  });

  return referendums;
}

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
      condition["state.state"] = status;
    }
    const proposalCol = await getProposalCollection(chain);

    const total = proposalCol.countDocuments(condition);
    const list = proposalCol.aggregate([
      { $match: condition },
      {
        $addFields: {
          sort: {
            $switch: {
              branches: [
                { case: { $eq: ["$state.state", "ApproveVoting"] }, then: 10 },
                { case: { $eq: ["$state.state", "RejectVoting"] }, then: 9 },
                { case: { $eq: ["$state.state", "Proposed"] }, then: 8 },
                { case: { $eq: ["$state.state", "Approved"] }, then: 7 },
              ],
              default: 0,
            }
          }
        }
      },
      {
        $sort: {
          sort: -1,
          "indexer.blockHeight": -1,
        }
      },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $project: {
          sort: 0,
          timeline: 0,
        }
      }
    ]).toArray();

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
        description: item.description,
        tags: item.tags ?? {},
        latestState: {
          state: item.state?.state || item.state?.name,
          time: (
            item.state?.eventIndexer ||
            item.state?.extrinsicIndexer ||
            item.state?.indexer
          ).blockTime,
          motionVoting: item.state?.data?.motionVoting,
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
    if (!proposal) {
      ctx.status = 404;
      return;
    }

    const motions = await getProposalMotions(proposal, chain);
    const referendums = await getProposalReferendums(proposal, chain);

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
      motions,
      referendums,
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
            _id: "$state.state",
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

  async getRates(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    ctx.body = await rateService.getRates(
      {
        chain,
        type: "proposal",
        index: proposalIndex,
      },
      page,
      pageSize
    );
  }

  async getRateStats(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await rateService.getRateStats({
      chain,
      type: "proposal",
      index: proposalIndex,
    });
  }

  async getProposalDescription(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await descriptionService.getDescription({
      indexer: {
        chain,
        type: "proposal",
        index: proposalIndex,
      },
    });
  }

  async setProposalDescription(ctx) {
    const { chain } = ctx.params;
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { description, proposalType, status } = ctx.request.body;

    ctx.body = await descriptionService.setDescription(
      {
        indexer: {
          chain,
          type: "proposal",
          index: proposalIndex,
        },
        description,
        proposalType,
        status,
      },
      ctx.request.headers.signature
    );
  }
}

module.exports = new ProposalsController();
