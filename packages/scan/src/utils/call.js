const {
  Modules,
  CouncilMethods,
  ProposalMethods,
  TipMethods,
  BountyMethods,
} = require("./constants");

const treasuryProposalCouncilIndexes = ["0x1201", "0x1202"];
const approveProposalIndex = "0x1202";
const rejectProposalIndex = "0x1201";

const callIndexs = {
  "0x0e03": {
    callIndex: "0x0e03",
    module: Modules.Council,
    method: CouncilMethods.vote,
  },
  "0x1200": {
    callIndex: "0x1200",
    module: Modules.Treasury,
    method: ProposalMethods.proposeSpend,
  },
  "0x1201": {
    callIndex: "0x1201",
    module: Modules.Treasury,
    method: ProposalMethods.rejectProposal,
  },
  "0x1202": {
    callIndex: "0x1202",
    module: Modules.Treasury,
    method: ProposalMethods.approveProposal,
  },
  "0x1205": {
    callIndex: "0x1205",
    module: Modules.Treasury,
    method: TipMethods.tipNew,
  },
  "0x1209": {
    callIndex: "0x1209",
    module: Modules.Treasury,
    method: BountyMethods.approveBounty,
  },
  "0x120a": {
    callIndex: "0x120a",
    module: Modules.Treasury,
    method: BountyMethods.proposeCurator,
  },
};

module.exports = {
  translate(callIndex) {
    return callIndexs[callIndex];
  },
  treasuryProposalCouncilIndexes,
  approveProposalIndex,
  rejectProposalIndex,
};
