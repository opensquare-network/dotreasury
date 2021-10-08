const { getConstFromRegistry } = require("../../../utils");
const { findRegistry } = require("../../../chain/specs");

async function getBurnPercent(blockHeight) {
  const registry = await findRegistry(blockHeight);
  const burnPercent = getConstFromRegistry(registry, "Treasury", "Burn");

  return burnPercent.toHuman();
}

module.exports = {
  getBurnPercent,
}
