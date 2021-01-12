const { getProposalCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.services");

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
      items: proposals.map(item => ({
        indexer: item.indexer,
        proposalIndex: item.proposalIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        proposer: item.proposer,
        value: item.value,
        beneficiary: item.beneficiary,
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
    const proposalMotions = await motionCol.find({ treasuryProposalId: proposalIndex }).sort({ index: 1 }).toArray();

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
    const numOfNewProposals = await proposalCol.countDocuments({"state.name": "Proposed"});
    const numOfAwarded = await proposalCol.countDocuments({"state.name": "Awarded"});

    ctx.body = {
      total,
      numOfNewProposals,
      numOfAwarded,
    }
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

    ctx.body = await linkService.createLink({
      type: "proposals",
      indexer: proposalIndex,
      link,
      description,
    }, ctx.request.headers.signature)
  }

  async deleteProposalLink(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink({
      type: "proposals",
      indexer: proposalIndex,
      linkIndex,
    }, ctx.request.headers.signature)
  }
}

module.exports = new ProposalsController();
