const { handlePeriod } = require("./period");
const { handleReferenda } = require("./referenda");

async function handleBlockJobs(blockIndexer) {
  await handlePeriod(blockIndexer);
  await handleReferenda(blockIndexer);
}

module.exports = {
  handleBlockJobs,
}
