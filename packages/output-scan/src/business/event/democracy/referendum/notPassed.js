const { handleBusinessWhenVoteFinished } = require("./hooks/voteFinished");
const { handleVoteFinished } = require("./common");

async function handleNotPassed(event, indexer) {
  await handleVoteFinished(event, indexer)

  const [referendumIndex] = event.data.toJSON();
  await handleBusinessWhenVoteFinished(false, referendumIndex, indexer);
}

module.exports = {
  handleNotPassed,
}
