const { logger } = require("@dotreasury/common");
const { getSpecHeights } = require("./index");

function checkSpecs() {
  const specHeights = getSpecHeights();
  if (specHeights.length <= 0 || specHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    throw "No specHeights or invalid";
  }
}

module.exports = {
  checkSpecs,
}
