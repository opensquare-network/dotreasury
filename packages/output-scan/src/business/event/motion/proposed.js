const { isBountyMotion } = require("../../common/bounty/utils/motion");
const { handleWrappedCall } = require("../../common/call");
const {
  handleBusinessWhenMotionProposed,
  isProposalMotion,
} = require("./hooks/proposed");
const { insertMotion } = require("../../../mongo/service/motion");
const {
  consts: {
    TimelineItemTypes,
    CouncilEvents,
  }
} = require("@osn/scan-common")
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

  const treasuryProposals = [];
  const treasuryBounties = [];
  await handleWrappedCall(
    rawProposal,
    proposer,
    indexer,
    blockEvents,
    (call) => {
      const { section, method, args } = call;
      if (isProposalMotion(section, method)) {
        const treasuryProposalIndex = args[0].toJSON();
        treasuryProposals.push({
          index: treasuryProposalIndex,
          method,
        });
      } else if (isBountyMotion(section, method)) {
        const treasuryBountyIndex = args[0].toJSON();
        treasuryBounties.push({
          index: treasuryBountyIndex,
          method,
        });
      }
    },
  )

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
    treasuryProposals,
    treasuryBounties,
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, rawProposal, indexer, blockEvents);
}

module.exports = {
  handleProposed,
}
