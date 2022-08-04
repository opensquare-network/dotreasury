const { updateProposalWithReferendum } = require("../../../../../mongo/service/treasuryProposal");
const { handleWrappedCall } = require("../../../../common/call");
const {
  consts: {
    Modules,
    TreasuryProposalMethods,
    MotionState,
  }
} = require("@osn/scan-common");

function isTreasuryProposal(section, method) {
  return Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
}

async function handleProposal(referendumInfo, call, indexer) {
  const { section, method, args } = call;
  if (!isTreasuryProposal(section, method)) {
    return
  }

  const treasuryProposalIndex = args[0].toJSON();
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const { referendumIndex, meta } = referendumInfo;
  const state = {
    indexer,
    state: stateName,
    data: {
      referendumIndex,
      meta,
    },
  };

  await updateProposalWithReferendum(treasuryProposalIndex, { state }, {
    ...referendumInfo,
    method,
    treasuryProposalIndex,
    indexer
  });
}

async function handleBusiness(call, author, indexer) {
  await handleProposal(this.referendumInfo, call, indexer);
}

async function handleBusinessWhenReferendumStarted(referendumIndex, meta, call, indexer) {
  await handleWrappedCall(
    call,
    null,
    indexer,
    [],
    handleBusiness.bind({ referendumInfo: { referendumIndex, meta } }),
  )
}

module.exports = {
  handleBusinessWhenReferendumStarted,
}
