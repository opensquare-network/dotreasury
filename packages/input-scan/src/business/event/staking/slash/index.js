const { bigAdd } = require("../../../../utils");
const { handleSlashedEvent } = require("./slashed");
const { handleSlashEvent } = require("./slash");

async function handleStakingSlash(event, indexer, blockEvents) {
  const bySlash = await handleSlashEvent(...arguments);
  const bySlashed = await handleSlashedEvent(...arguments);

  let result = 0;
  if (bySlash) {
    result = bigAdd(result, bySlash.balance);
  }
  if (bySlashed) {
    result = bigAdd(result, bySlashed.balance);
  }

  return result;
}

module.exports = {
  handleStakingSlash,
}
