const { gov2ReferendumState } = require("./state");

function getStateFromGov2ReferendumState(ongoingStatus = {}, indexer) {
  const {
    origin,
    submitted,
    proposal,
    inQueue,
    deciding,
  } = ongoingStatus;
  if (!origin || !submitted || !proposal) {
    throw new Error(`Not a valid gov2 referendum status at ${ indexer.blockHeight }`)
  }

  if (inQueue) {
    return gov2ReferendumState.Queueing;
  }

  if (!deciding) {
    return null; // it means we can't get the state from the ongoing referendum status, maybe we should throw.
  }

  const { confirming } = deciding;
  if (confirming) {
    return gov2ReferendumState.Confirming;
  } else {
    return gov2ReferendumState.Deciding;
  }
}

module.exports = {
  getStateFromGov2ReferendumState,
}
