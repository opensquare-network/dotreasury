const {
  getProposalTimelineCollection,
  getProposalCollection,
} = require("../mongo");
const { getApi } = require("../api");
const { ProposalState } = require("../utils/constants");

async function saveNewProposal(proposalIndex, indexer, extrinsic) {
  const api = await getApi();
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );
  const metaJson = meta.toJSON();

  let {
    signer: proposer,
    args: { value, beneficiary },
  } = extrinsic;

  if (metaJson) {
    proposer = metaJson.proposer;
    value = metaJson.value;
    beneficiary = metaJson.beneficiary;
  }

  const proposalCol = await getProposalCollection();
  await proposalCol.insertOne({
    indexer,
    proposalIndex,
    proposer,
    value,
    beneficiary,
    meta: metaJson,
    state: {
      name: ProposalState.Proposed,
      indexer,
    },
  });
}

async function updateProposalStateByEvent(
  event,
  blockIndexer,
  nullableNormalizedExtrinsic
) {
  const { method, data } = event;
  const eventData = data.toJSON();
  const proposalIndex = eventData[0];

  const col = await getProposalCollection();
  await col.updateOne(
    { proposalIndex },
    {
      $set: {
        state: {
          name: method,
          data: eventData,
          indexer:
            nullableNormalizedExtrinsic?.extrinsicIndexer || blockIndexer,
        },
      },
    }
  );
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
  updateProposalStateByEvent,
};
