const {
  ProposalState,
  timelineItemTypes,
  ProposalEvents,
} = require("../../../utils/constants");
const { getProposalCollection } = require("../../../mongo");
const { getApi } = require("../../../api");

async function handleProposed(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const [proposalIndex] = eventData;

  const api = await getApi();
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );
  const metaJson = meta.toJSON();

  let {
    signer: proposer,
    args: { value, beneficiary },
  } = normalizedExtrinsic;

  if (metaJson) {
    proposer = metaJson.proposer;
    value = metaJson.value;
    beneficiary = metaJson.beneficiary;
  }

  const timelineItem = {
    type: timelineItemTypes.extrinsic,
    name: ProposalEvents.Proposed,
    args: {
      proposer,
      value,
      beneficiary,
    },
    eventData,
    extrinsicIndexer: indexer,
  };

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
    timeline: [timelineItem],
  });
}

module.exports = {
  handleProposed,
};
