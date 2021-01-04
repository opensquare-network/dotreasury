const { getProposalCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

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
        proposalIndex: item.proposalIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        proposer: item.proposer,
        value: item.value,
        beneficiary: item.beneficiary,
        latestState: {
          state: item.state?.name,
          time: null, // TODO: Missing
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

    if (!proposal) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      proposalIndex: proposal.proposalIndex,
      proposeTime: proposal.indexer.blockTime,
      proposeAtBlockHeight: proposal.indexer.blockHeight,
      proposer: proposal.proposer,
      value: proposal.value,
      beneficiary: proposal.beneficiary,
      latestState: {
        state: proposal.state?.name,
        time: null, // TODO: Missing
      },
    };
  }
}

module.exports = new ProposalsController();
