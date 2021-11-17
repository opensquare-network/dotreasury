const { updateBounty } = require("../../../../mongo/service/bounty");
const { handleWrappedCall } = require("../../../common/call");
const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  Modules,
  TreasuryProposalMethods,
  MotionState,
  BountyMethods,
} = require("../../../common/constants");
const { logger } = require("../../../../logger");

function isProposalMotion(section, method) {
  return Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
}

async function handleProposalCall(motion, call, author, indexer) {
  const { section, method, args } = call;
  if (!isProposalMotion(section, method)) {
    return
  }

  const treasuryProposalIndex = args[0].toJSON();
  const motionInfo = {
    indexer,
    index: motion.index,
    hash: motion.hash,
    method,
    proposer: author,
  }

  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motion.state,
      motionVoting: motion.voting,
    },
  };

  logger.info(`Detected motion for treasury proposal ${ treasuryProposalIndex } ${ method }`, motionInfo);
  await updateProposal(treasuryProposalIndex, { state }, null, motionInfo);
}

function isBountyMotion(section, method) {
  return [Modules.Treasury, Modules.Bounties].includes(section) && [
    BountyMethods.approveBounty,
    BountyMethods.proposeCurator,
    BountyMethods.unassignCurator,
    BountyMethods.closeBounty,
  ].includes(method)
}

async function handleBountyCall(motion, call, author, indexer) {
  const { section, method, args } = call;
  if (!isBountyMotion(section, method)) {
    return
  }

  const treasuryBountyIndex = args[0].toJSON();
  const motionInfo = {
    indexer,
    index: motion.index,
    hash: motion.hash,
    method,
    proposer: author,
  }

  let updates = {};
  let stateName;
  if (BountyMethods.closeBounty === method) {
    stateName = 'CloseVoting';
  } else if (BountyMethods.approveBounty === method) {
    stateName = 'ApproveVoting';
  }

  if (stateName) {
    updates = {
      state: {
        indexer,
        state: 'CloseVoting',
        data: {
          motionState: motion.state,
          motionVoting: motion.voting,
        },
      }
    }
  }

  logger.info(`Detected motion for bounty ${ treasuryBountyIndex } ${ method }`, motionInfo);
  await updateBounty(treasuryBountyIndex, updates, null, motionInfo);
}

async function handleBusiness(call, author, indexer) {
  await handleProposalCall(this.motion, ...arguments);
  await handleBountyCall(this.motion, ...arguments);
}

async function handleBusinessWhenMotionProposed(motionDbObj = {}, rawProposal, indexer, blockEvents) {
  await handleWrappedCall(
    rawProposal,
    motionDbObj.proposer,
    indexer,
    blockEvents,
    handleBusiness.bind({ motion: motionDbObj }),
  )
}

module.exports = {
  handleBusinessWhenMotionProposed,
  isProposalMotion,
  isBountyMotion,
};
