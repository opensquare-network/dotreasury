const {
  consts: {
    Modules,
    BountyMethods,
  }
} = require("@osn/scan-common")

function isStateChangeBountyMotion(method) {
  return [
    BountyMethods.approveBounty,
    BountyMethods.closeBounty,
  ].includes(method)
}

function isBountyMotion(section, method) {
  return [Modules.Treasury, Modules.Bounties].includes(section) && [
    BountyMethods.approveBounty,
    BountyMethods.proposeCurator,
    BountyMethods.unassignCurator,
    BountyMethods.closeBounty,
  ].includes(method)
}

module.exports = {
  isBountyMotion,
  isStateChangeBountyMotion,
}
