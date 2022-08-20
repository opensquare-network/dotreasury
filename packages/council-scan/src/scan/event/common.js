const {
  consts: { Modules },
} = require("@osn/scan-common");

function isElectionModule(section) {
  return [
    Modules.ElectionsPhragmen,
    Modules.PhragmenElection,
  ].includes(section)
}

module.exports = {
  isElectionModule,
}
