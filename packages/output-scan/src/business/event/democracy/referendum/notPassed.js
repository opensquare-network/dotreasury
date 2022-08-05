const { handleVoteFinished } = require("./common");

async function handleNotPassed(event, indexer) {
  await handleVoteFinished(event, indexer)
}

module.exports = {
  handleNotPassed,
}
