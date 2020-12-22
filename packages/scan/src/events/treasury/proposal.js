const {
  getProposalCollection,
  getProposalStateCollection,
} = require("../../mongo");
const { getApi } = require("../../api");

function isProposalEvent(method) {
  return ["Proposed", "Awarded", "Rejected"].includes(method);
}

const isStateChange = isProposalEvent;

async function handleProposalEvent(method, jsonData, indexer, sort) {
  if (!isProposalEvent(method)) {
    return;
  }

  if (method === "Proposed") {
    const [proposalIndex] = jsonData;
    await saveNewProposal(proposalIndex, indexer);
  } else if (method === "Awarded") {
    const [proposalIndex, balance, accountId] = jsonData;
  } else if (method === "Rejected") {
    const [proposalIndex, balance] = jsonData;
  }

  if (isStateChange(method)) {
    const proposalIndex = jsonData[0];
    const state = method;
    await saveProposalState(proposalIndex, state, indexer, sort);
  }
}

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

async function saveProposalState(proposalIndex, state, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.proposals.at(
    indexer.blockHash,
    proposalIndex
  );

  const proposalStateCol = await getProposalStateCollection();
  await proposalStateCol.insertOne({
    indexer,
    sort,
    proposalIndex,
    state,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleProposalEvent,
};
