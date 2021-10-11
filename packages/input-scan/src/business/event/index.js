const { handleProposalSlash } = require("./treasury/proposalSlash");
const { handleInflation } = require("./staking/inflation");
const {
  Modules,
  TreasuryCommonEvent,
} = require("../../business/common/constants")

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

  await handleInflation(event, indexer, blockEvents);
  await handleProposalSlash(event, indexer, blockEvents);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, } = events[sort];

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    await handleCommon(blockIndexer, event, sort, events);
  }
}

module.exports = {
  handleEvents,
}
