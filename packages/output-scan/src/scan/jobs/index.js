const { handlePeriod } = require("./period");

async function handleBlockJobs(blockIndexer) {
  await handlePeriod(blockIndexer);
}

module.exports = {
  handleBlockJobs,
}
