// Passed or NotPassed event
const { updateProposal } = require("../../../../../mongo/service/treasuryProposal");
const { getReferendum } = require("../../../../../mongo/service/democracyReferendum");
const {
  consts: {
    TreasuryProposalMethods,
    CouncilEvents,
  }
} = require("@osn/scan-common");


function getState(isReferendumPassed, treasuryMethod) {
  if (TreasuryProposalMethods.approveProposal === treasuryMethod && isReferendumPassed) {
    return CouncilEvents.Approved;
  }

  return null;
}

async function handleBusinessWhenVoteFinished(isPassed, referendumIndex, indexer) {
  const referendum = await getReferendum(referendumIndex);

  for (const proposal of referendum?.treasuryProposals || []) {
    const { index: proposalIndex, method } = proposal;
    const proposalState = getState(isPassed, method);
    if (!proposalState) {
      continue
    }

    const state = {
      state: proposalState,
      indexer,
    };

    await updateProposal(proposalIndex, { state });
  }
}

module.exports = {
  handleBusinessWhenVoteFinished,
}
