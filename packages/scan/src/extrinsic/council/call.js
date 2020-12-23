const callIndexs = {
  "0x1200": {
    module: "treasury",
    method: "proposeSpend",
  },
  "0x1201": {
    module: "treasury",
    method: "rejectProposal",
  },
  "0x1202": {
    module: "treasury",
    method: "approveProposal",
  },
  "0x1205": {
    module: "treasury",
    method: "tipNew",
  },
  "0x1209": {
    module: "treasury",
    method: "approveBounty",
  },
  "0x120a": {
    module: "treasury",
    method: "proposeCurator",
  },
};

module.exports = {
  translate(callIndex) {
    return callIndexs[callIndex];
  },
};
