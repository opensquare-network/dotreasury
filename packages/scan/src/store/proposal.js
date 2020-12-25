const {
  getProposalTimelineCollection,
  getProposalCollection,
} = require("../mongo");
const { getApi } = require("../api");

async function saveNewProposal(proposalIndex, indexer) {
  const api = await getApi();
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );

  const proposalCol = await getProposalCollection();
  await proposalCol.insertOne({
    indexer,
    proposalIndex,
    meta: meta.toJSON(),
  });
}

async function connectCouncilProposal(proposalIndex, proposalHash, indexer) {
  const proposalCol = await getProposalCollection();
  await proposalCol.updateOne(
    {
      proposalIndex,
    },
    {
      $push: {
        councilProposals: {
          indexer,
          proposalHash,
        },
      },
    }
  );
}

async function saveProposalTimeline(proposalIndex, state, data, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );

  const proposalTimelineCol = await getProposalTimelineCollection();
  await proposalTimelineCol.insertOne({
    indexer,
    sort,
    proposalIndex,
    state,
    data,
    meta: meta.toJSON(),
  });
}

module.exports = {
  saveNewProposal,
  saveProposalTimeline,
  connectCouncilProposal,
};
