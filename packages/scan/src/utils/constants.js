const ksmFirstTipClosedHeight = 2192357

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
});

const ProxyMethods = Object.freeze({
  proxy: "proxy"
})

module.exports = {
  Modules,
  BountyMethods,
  BountyEvents,
  ProposalMethods,
  ProposalEvents,
  TipMethods,
  TipEvents,
  CouncilEvents,
  CouncilMethods,
  ProxyMethods,
  ksmFirstTipClosedHeight,
};
