const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const { insertMotion } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");
const { getVotingFromStorage } = require("../../common/motion/votingStorage");
const { getMotionCall, getMotionProposalCall } = require("../../common/motion/proposalStorage");

async function handleProposed(event, extrinsic, indexer, blockEvents) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const rawProposal = await getMotionCall(hash, indexer);
  const proposalCall = await getMotionProposalCall(hash, indexer);
  const voting = await getVotingFromStorage(indexer.blockHash, hash);

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
    proposal: proposalCall,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, rawProposal, indexer, blockEvents);
}

module.exports = {
  handleProposed,
}
