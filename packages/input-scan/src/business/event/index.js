const { handleKilledSlash } = require("./identity/killedSlash");
const { handleTransfer } = require("./transfer");
const { handleTreasurySlash } = require("./treasury");
const { handleInflation } = require("./staking/inflation");
const {
  Modules,
  TreasuryCommonEvent,
} = require("../../business/common/constants")

async function handleDeposit(
  blockIndexer,
  event,
  eventSort,
  blockEvents,
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  await handleInflation(event, indexer, blockEvents);
  await handleTreasurySlash(event, indexer, blockEvents);
  await handleTransfer(event, indexer);
  await handleKilledSlash(event, indexer, blockEvents);
}

async function handleCommon(
  blockIndexer,
  event,
  eventSort,
  blockEvents,
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  await handleTransfer(event, indexer);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, } = events[sort];

    await handleCommon(blockIndexer, event, sort, events);

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    await handleDeposit(blockIndexer, event, sort, events);
  }
}

module.exports = {
  handleEvents,
}
