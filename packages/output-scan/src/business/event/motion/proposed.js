const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const { insertMotion } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
  TreasuryProposalMethods,
  Modules,
} = require("../../common/constants");
const { getVotingFromStorage } = require("../../common/motion/votingStorage");
const { getMotionProposalCall } = require("../../common/motion/proposalStorage");

function extractBusinessFields(proposal = {}) {
  const { section, method, args } = proposal;
  if (
    Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
  ) {
    return {
      isTreasury: true,
      treasuryProposalIndex: args[0].value,
    };
  }

  return {};
}

async function handleProposed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const proposal = await getMotionProposalCall(hash, indexer);
  const voting = await getVotingFromStorage(hash, indexer);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Proposed,
    args: {
      proposer,
      index: motionIndex,
      hash,
      threshold,
    },
    indexer,
  };

  const state = {
    indexer,
    state: CouncilEvents.Proposed,
    data: eventData,
  };

  const obj = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    ...extractBusinessFields(proposal),
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, indexer);
}

module.exports = {
  handleProposed,
}
