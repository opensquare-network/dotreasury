const { handleRejected } = require("./rejected");
const { handleTimedOut } = require("./timedout");
const { handleKilled } = require("./killed");
const { handleCancelled } = require("./cancelled");
const { handleConfirmed } = require("./confirmed");
const { handleConfirmAborted } = require("./confirmAborted");
const { handleConfirmStarted } = require("./confirmStarted");
const { handleDecisionStarted } = require("./decisionStarted");
const { handleDecisionDepositPlaced } = require("./decisionDepositPlaced");
const { handleSubmitted } = require("./submitted");
const {
  consts: {
    Modules,
    ReferendaEvents,
  },
} = require("@osn/scan-common")

async function handleReferendaEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (Modules.Referenda !== section) {
    return
  }

  if (ReferendaEvents.Submitted === method) {
    await handleSubmitted(event, indexer);
  } else if (ReferendaEvents.DecisionDepositPlaced === method) {
    await handleDecisionDepositPlaced(event, indexer);
  } else if (ReferendaEvents.DecisionStarted === method) {
    await handleDecisionStarted(event, indexer);
  } else if (ReferendaEvents.ConfirmStarted === method) {
    await handleConfirmStarted(event, indexer);
  } else if (ReferendaEvents.ConfirmAborted === method) {
    await handleConfirmAborted(event, indexer);
  } else if (ReferendaEvents.Confirmed === method) {
    await handleConfirmed(event, indexer, extrinsic, blockEvents);
  } else if (ReferendaEvents.Cancelled === method) {
    await handleCancelled(...arguments);
  } else if (ReferendaEvents.Killed === method) {
    await handleKilled(...arguments);
  } else if (ReferendaEvents.TimedOut === method) {
    await handleTimedOut(...arguments);
  } else if (ReferendaEvents.Rejected === method) {
    await handleRejected(...arguments);
  }
}

module.exports = {
  handleReferendaEvent,
}
