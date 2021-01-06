const { getProposalCollection } = require("../mongo");
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

module.exports = {
  saveNewProposal,
  updateProposalStateByEvent,
};
