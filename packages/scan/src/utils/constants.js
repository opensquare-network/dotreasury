const ksmFirstTipClosedHeight = 2192357;
const ksmFirstRejectedEventHeight = 1164233;
const ksmTreasuryRefactorApplyHeight = 6143966;

const TreasuryAccount = "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

const ProposalState = Object.freeze({
  Proposed: "Proposed",
  ApproveVoting: "ApproveVoting",
  RejectVoting: "RejectVoting",
  Rejected: "Rejected",
  Approved: "Approved",
  Awarded: "Awarded",
});

const TipEvents = Object.freeze({
  NewTip: "NewTip",
  TipClosing: "TipClosing",
  TipClosed: "TipClosed",
  TipRetracted: "TipRetracted",
});

const TipMethods = Object.freeze({
  tipNew: "tipNew",
  reportAwesome: "reportAwesome",
  retractTip: "retractTip",
  tip: "tip",
  closeTip: "closeTip",
});

const ProposalEvents = Object.freeze({
  Proposed: "Proposed",
  Awarded: "Awarded",
  Rejected: "Rejected",
});

const ProposalMethods = Object.freeze({
  proposeSpend: "proposeSpend",
  rejectProposal: "rejectProposal",
  approveProposal: "approveProposal",
});

const BountyEvents = Object.freeze({
  BountyProposed: "BountyProposed",
  BountyRejected: "BountyRejected",
  BountyBecameActive: "BountyBecameActive",
  BountyAwarded: "BountyAwarded",
  BountyClaimed: "BountyClaimed",
  BountyCanceled: "BountyCanceled",
  BountyExtended: "BountyExtended",
});

const BountyMethods = Object.freeze({
  proposeBounty: "proposeBounty",
  approveBounty: "approveBounty",
  proposeCurator: "proposeCurator",
  unassignCurator: "unassignCurator",
  acceptCurator: "acceptCurator",
  awardBounty: "awardBounty",
  claimBounty: "claimBounty",
  closeBounty: "closeBounty",
  extendBountyExpiry: "extendBountyExpiry",
});

const CouncilEvents = Object.freeze({
  Proposed: "Proposed",
  Voted: "Voted",
  Approved: "Approved",
  Disapproved: "Disapproved",
  Executed: "Executed",
  Closed: "Closed",
});

const CouncilMethods = Object.freeze({
  propose: "propose",
  vote: "vote",
  close: "close",
});

const Modules = Object.freeze({
  Treasury: "treasury",
  Council: "council",
  Proxy: "proxy",
  Multisig: "multisig",
  Utility: "utility",
  Tips: "tips",
  Bounties: "bounties",
  Staking: "staking",
});

const ProxyMethods = Object.freeze({
  proxy: "proxy",
});

const MultisigMethods = Object.freeze({
  asMulti: "asMulti",
});

const UtilityMethods = Object.freeze({
  batch: "batch",
});

const TreasuryEvent = Object.freeze({
  Burnt: "Burnt",
  Deposit: "Deposit",
});

const StakingEvents = Object.freeze({
  EraPayout: "EraPayout",
});

module.exports = {
  Modules,
  BountyMethods,
  BountyEvents,
  StakingEvents,
  ProposalMethods,
  ProposalEvents,
  TipMethods,
  TipEvents,
  TreasuryEvent,
  CouncilEvents,
  CouncilMethods,
  ProxyMethods,
  MultisigMethods,
  ksmFirstTipClosedHeight,
  ProposalState,
  ksmFirstRejectedEventHeight,
  TreasuryAccount,
  UtilityMethods,
  ksmTreasuryRefactorApplyHeight,
};
