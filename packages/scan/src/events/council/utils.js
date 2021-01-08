const { ProposalMethods, BountyMethods } = require("../../utils/constants");

function isProposalMotion(method) {
  return [
    ProposalMethods.approveProposal,
    ProposalMethods.rejectProposal,
  ].includes(method);
}

function isBountyMotion(method) {
  return [
    BountyMethods.approveBounty,
    BountyMethods.proposeCurator,
    BountyMethods.unassignCurator,
    BountyMethods.closeBounty,
  ].includes(method);
}

function getBountyVotingName(method) {
  switch (method) {
    case BountyMethods.approveBounty:
      return "ApproveVoting";
    case BountyMethods.proposeCurator:
      return "ProposeCuratorVoting";
    case BountyMethods.unassignCurator:
      return "UnassignCuratorVoting";
    case BountyMethods.closeBounty:
      return "CloseVoting";
  }
}

module.exports = {
  isProposalMotion,
  isBountyMotion,
  getBountyVotingName,
};
