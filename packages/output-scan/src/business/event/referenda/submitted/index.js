const { handlePendingReferendum } = require("./nonCall");
const { getCall } = require("./proposal");
const { handleTreasurySpend } = require("./spend");

async function handleSubmitted(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  const track = event.data[1].toNumber();

  const proposal = event.data[2].toJSON();
  const { proposalHash, call } = await getCall(proposal, indexer.blockHash);
  if (call) {
    await handleTreasurySpend(referendumIndex, track, proposalHash, call, indexer);
  } else {
    await handlePendingReferendum(referendumIndex, track, proposalHash, indexer);
  }
  // todo: we will also handle other calls by referenda
}

module.exports = {
  handleSubmitted,
}
