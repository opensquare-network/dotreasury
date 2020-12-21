function isProposalEvent(method) {
  return [
    "Proposed",
    "Spending",
    "Awarded",
    "Rejected",
    "Burnt",
    "Rollover",
    "Deposit",
  ].includes(method);
}

async function handleProposalEvent(method, jsonData, indexer, sort) {
  if (method === "Proposed") {
    const [index] = jsonData;
  } else if (method === "Spending") {
    const [balance] = jsonData;
  } else if (method === "Awarded") {
    const [index, balance, accountId] = jsonData;
  } else if (method === "Rejected") {
    const [index, balance] = jsonData;
  } else if (method === "Burnt") {
    const [balance] = jsonData;
  } else if (method === "Rollover") {
    const [balance] = jsonData;
  } else if (method === "Deposit") {
    const [balance] = jsonData;
  }
}

module.exports = {
  isProposalEvent,
  handleProposalEvent,
};
