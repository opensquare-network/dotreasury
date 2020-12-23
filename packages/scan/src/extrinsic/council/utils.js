function retrieveCouncilProposalHash(events) {
  for (e of events) {
    const { event } = e;
    const method = event.method;
    const data = event.data.toJSON();

    if (method === "Proposed") {
      const [account, proposalIndex, proposalHash, threshold] = data;
      return proposalHash;
    } else if (method === "Executed") {
      const [proposalHash, result] = data;
      return proposalHash;
    }
  }

  return null;
}

module.exports = {
  retrieveCouncilProposalHash,
};
