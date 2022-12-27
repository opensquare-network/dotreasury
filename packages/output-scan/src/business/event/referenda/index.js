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
  } else if (ReferendaEvents.Killed === method) {
  } else if (ReferendaEvents.TimedOut === method) {
  } else if (ReferendaEvents.Rejected === method) {
  }
  // todo: handle various methods
}

module.exports = {
  handleReferendaEvent,
}
