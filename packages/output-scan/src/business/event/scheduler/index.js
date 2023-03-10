const { handleDispatched } = require("./dispatched");

const events = Object.freeze({
  Dispatched: "Dispatched",
});

async function handleSchedulerEvents(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if ("scheduler" !== section) {
    return
  }

  if (events.Dispatched === method) {
    await handleDispatched(event, indexer, extrinsic, blockEvents);
  }
}

module.exports = {
  handleSchedulerEvents,
}
