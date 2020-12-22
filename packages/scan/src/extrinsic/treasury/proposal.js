const { getApi } = require("../../api");
const { getProposalStateCollection } = require("../../mongo");

async function handleProposalExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== "treasury") {
    return;
  }

  if (!isSuccess) {
    return;
  }

  // Proposal methods
  if (name === "proposeSpend") {
    await handleProposeSpend(args, indexer, events);
  } else if (name === "rejectProposal") {
    await handleRejectProposal(args, indexer, events);
  } else if (name === "approveProposal") {
    await handleApproveProposal(args, indexer, events);
  }
}

async function handleProposeSpend(args, indexer, events) {
  const { value, beneficiary } = args;
}

async function handleRejectProposal(args, indexer, events) {
  const { proposal_id } = args;
}

async function handleApproveProposal(args, indexer, events) {
  const { proposal_id: proposalIndex } = args;

  await saveProposalState(proposalIndex, "ApproveProposal", args, indexer);
}

async function saveProposalState(proposalIndex, state, args, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );

  const tipStateCol = await getProposalStateCollection();
  await tipStateCol.insertOne({
    indexer,
    sort,
    proposalIndex,
    args,
    state,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleProposalExtrinsic,
};
