const { handleConvictionVotingVote } = require("./vote");
const { handleConvictionVotingRemoveVote } = require("./removeVote");
const { busLogger: logger } = require("@osn/scan-common");

async function handleConvictionVotingCalls(call, author, extrinsicIndexer, wrappedEvents) {
  try {
    await handleConvictionVotingVote(call, extrinsicIndexer, wrappedEvents);
    await handleConvictionVotingRemoveVote(call, extrinsicIndexer, wrappedEvents);
  } catch (e) {
    logger.error(`Handle conviction voting call error at ${ extrinsicIndexer.blockHeight }`, e);
  }
}

module.exports = {
  handleConvictionVotingCalls,
}
