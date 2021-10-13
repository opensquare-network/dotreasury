const { getProposalMeta } = require("./utils");
const {
  ProposalState,
  timelineItemTypes,
  ProposalEvents,
} = require("../../../utils/constants");
const { getProposalCollection } = require("../../../mongo");

async function handleProposed(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const [proposalIndex] = eventData;

  const extrinsicIndexer = normalizedExtrinsic.extrinsicIndexer;
  const metaJson = await getProposalMeta(
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
