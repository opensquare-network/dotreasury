const { getProposalMeta } = require("./utils");
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
  const extrinsicIndexer = normalizedExtrinsic.extrinsicIndexer;
  const metadata = await api.rpc.state.getMetadata(extrinsicIndexer.blockHash);
  const metaJson = await getProposalMeta(
    api,
    metadata,
    extrinsicIndexer.blockHash,
    proposalIndex
  );

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
    extrinsicIndexer,
  };

  const proposalCol = await getProposalCollection();

  await proposalCol.insertOne({
    indexer: extrinsicIndexer,
    proposalIndex,
    proposer,
    value,
    beneficiary,
    meta: metaJson,
    state: {
      name: ProposalState.Proposed,
      extrinsicIndexer,
    },
    timeline: [timelineItem],
  });
}

module.exports = {
  handleProposed,
};
