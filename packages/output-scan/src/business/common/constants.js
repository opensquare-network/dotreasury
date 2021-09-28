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
  PhragmenElection: "PhragmenElection",
  Session: "session",
  Balances: "balances",
  Sudo: "sudo",
  TechnicalCommittee: "technicalCommittee",
});

const SudoMethods = Object.freeze({
  sudo: "sudo",
});

const DemocracyMethods = Object.freeze({
  externalPropose: "externalPropose",
  externalProposeMajority: "externalProposeMajority",
  externalProposeDefault: "externalProposeDefault",
  fastTrack: "fastTrack",
});

const KaruraModules = Object.freeze({
  GeneralCouncil: "generalCouncil",
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

const ProxyMethods = Object.freeze({
  proxy: "proxy",
});

const MultisigMethods = Object.freeze({
  asMulti: "asMulti",
});

const UtilityMethods = Object.freeze({
  batch: "batch",
});

const TimelineItemTypes = Object.freeze({
  extrinsic: "extrinsic",
  event: "event",
});

const CouncilEvents = Object.freeze({
  Proposed: "Proposed",
  Voted: "Voted",
  Approved: "Approved",
  Disapproved: "Disapproved",
  Executed: "Executed",
  Closed: "Closed",
});

const TechnicalCommitteeEvents = Object.freeze({
  ...CouncilEvents,
});

const TreasuryProposalEvents = Object.freeze({
  Proposed: "Proposed",
  Awarded: "Awarded",
  Rejected: "Rejected",
});

const TreasuryProposalMethods = Object.freeze({
  proposeSpend: "proposeSpend",
  rejectProposal: "rejectProposal",
  approveProposal: "approveProposal",
});

const MotionState = Object.freeze({
  ApproveVoting: "ApproveVoting",
  RejectVoting: "RejectVoting",
});

const DemocracyPublicProposalEvents = Object.freeze({
  Proposed: "Proposed",
  Tabled: "Tabled",
});

const ReferendumEvents = Object.freeze({
  Started: "Started",
  Passed: "Passed",
  NotPassed: "NotPassed",
  Cancelled: "Cancelled",
  Executed: "Executed",
});

const DemocracyExternalEvents = Object.freeze({
  Vetoed: "Vetoed",
  ExternalTabled: "ExternalTabled",
});

const DemocracyExternalStates = Object.freeze({
  Proposed: "Proposed",
  Tabled: "Tabled",
});

const PreImageEvents = Object.freeze({
  PreimageNoted: "PreimageNoted",
  PreimageUsed: "PreimageUsed",
  PreimageInvalid: "PreimageInvalid",
  PreimageMissing: "PreimageMissing",
  PreimageReaped: "PreimageReaped",
});

module.exports = {
  Modules,
  TipEvents,
  TipMethods,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TimelineItemTypes,
  CouncilEvents,
  KaruraModules,
  TreasuryProposalEvents,
  TreasuryProposalMethods,
  MotionState,
  DemocracyPublicProposalEvents,
  ReferendumEvents,
  DemocracyMethods,
  DemocracyExternalStates,
  TechnicalCommitteeEvents,
  SudoMethods,
  DemocracyExternalEvents,
  PreImageEvents,
};
