const {
  consts: { Modules },
  env: { currentChain }
} = require("@osn/scan-common");

function isElectionModule(section) {
  if ("centrifuge" === currentChain()) {
    return "elections" === section;
  }

  return [
    Modules.ElectionsPhragmen,
    Modules.PhragmenElection,
  ].includes(section)
}

module.exports = {
  isElectionModule,
}
