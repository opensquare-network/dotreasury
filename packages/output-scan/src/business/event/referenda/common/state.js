const gov2ReferendumState = Object.freeze({
  Submitted: "Submitted",
  Queueing: "Queueing",
  Deciding: "Deciding",
  Confirming: "Confirming",
  Approved: "Approved",
  Cancelled: "Cancelled",
  Killed: "Killed",
  TimedOut: "TimedOut",
  Rejected: "Rejected",
  Executed: "Executed",
});

module.exports = {
  gov2ReferendumState,
}
