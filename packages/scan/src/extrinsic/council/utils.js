const { CouncilEvents } = require("../../utils/constants");

function retrieveCouncilProposalHash(events) {
  for (e of events) {
    const { event } = e;
    const method = event.method;
    const data = event.data.toJSON();

    if (method === CouncilEvents.Proposed) {
      const [account, proposalIndex, proposalHash, threshold] = data;
      return proposalHash;
    } else if (method === CouncilEvents.Executed) {
      const [proposalHash, result] = data;
      return proposalHash;
    }
  }

  return null;
}

module.exports = {
  retrieveCouncilProposalHash,
};
