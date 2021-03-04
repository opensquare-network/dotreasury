const { getProposalCollection } = require("../mongo");
const { getApi } = require("../api");
const { ProposalState } = require("../utils/constants");
const { asyncLocalStorage } = require("../utils");

async function saveNewProposal(proposalIndex, nullableNormalizedExtrinsic) {
  const api = await getApi();
  const indexer = nullableNormalizedExtrinsic.extrinsicIndexer;
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );
  const metaJson = meta.toJSON();

  let {
    signer: proposer,
    args: { value, beneficiary },
  } = nullableNormalizedExtrinsic;

  if (metaJson) {
    proposer = metaJson.proposer;
    value = metaJson.value;
    beneficiary = metaJson.beneficiary;
  }

  const session = asyncLocalStorage.getStore();
  const proposalCol = await getProposalCollection();
  await proposalCol.insertOne(
    {
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
    },
    { session }
  );
}

async function updateProposalStateByEvent(
  event,
  blockIndexer,
  nullableNormalizedExtrinsic,
  eventSort
) {
  const { method, data } = event;
  const eventData = data.toJSON();
  const proposalIndex = eventData[0];
  const eventIndexer = { ...blockIndexer, eventSort };

  const session = asyncLocalStorage.getStore();
  const col = await getProposalCollection();
  await col.updateOne(
    { proposalIndex },
    {
      $set: {
        state: {
          name: method,
          data: eventData,
          indexer:
            nullableNormalizedExtrinsic?.extrinsicIndexer || eventIndexer,
        },
      },
    },
    { session }
  );
}

module.exports = {
  saveNewProposal,
  updateProposalStateByEvent,
};
