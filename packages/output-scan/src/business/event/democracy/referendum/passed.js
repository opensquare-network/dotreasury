const { handleBusinessWhenVoteFinished } = require("./hooks/voteFinished");
const { handleVoteFinished } = require("./common");

async function handlePassed(event, indexer) {
  await handleVoteFinished(event, indexer)

  const [referendumIndex] = event.data.toJSON();
  await handleBusinessWhenVoteFinished(true, referendumIndex, indexer);
}

module.exports = {
  handlePassed,
}
