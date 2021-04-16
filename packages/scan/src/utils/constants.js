const ksmFirstTipClosedHeight = 2192357;
const ksmFirstRejectedEventHeight = 1164233;
const ksmTreasuryRefactorApplyHeight = 6143966;

const TreasuryAccount = "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";
const DotTreasuryAccount = "13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB";

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
  TipSlashed: "TipSlashed",
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
  Identity: "identity",
  Democracy: "democracy",
  ElectionsPhragmen: "electionsPhragmen",
  Session: "session",
  Balances: "balances",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
});

const SessionEvents = Object.freeze({
  NewSession: "NewSession",
});

const ElectionsPhragmenEvents = Object.freeze({
  CandidateSlashed: "CandidateSlashed",
  SeatHolderSlashed: "SeatHolderSlashed",
  NewTerm: "NewTerm",
});

const DemocracyEvents = Object.freeze({
  Blacklisted: "Blacklisted",
  PreimageInvalid: "PreimageInvalid",
});

const DemocracyMethods = Object.freeze({
  cancelProposal: "cancel_proposal",
});

const ProxyMethods = Object.freeze({
  proxy: "proxy",
});

const IdentityEvents = Object.freeze({
  IdentityKilled: "IdentityKilled",
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
  Rejected: "Rejected",
  BountyRejected: "BountyRejected",
});

const TreasuryMethods = Object.freeze({
  unassignCurator: "unassign_curator",
});

const StakingEvents = Object.freeze({
  EraPayout: "EraPayout",
  Slash: "Slash",
  Reward: "Reward",
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
  DotTreasuryAccount,
  UtilityMethods,
  ksmTreasuryRefactorApplyHeight,
  TreasuryMethods,
  IdentityEvents,
  DemocracyEvents,
  DemocracyMethods,
  ElectionsPhragmenEvents,
  SessionEvents,
  BalancesEvents,
};
