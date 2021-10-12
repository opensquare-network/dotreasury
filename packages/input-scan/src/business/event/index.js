const { bigAdd } = require("../../utils");
const { handleSlashEvent } = require("./staking/slash/slashOrSlashed");
const { handleCancelProposalSlash } = require("./democracy/cancelProposal");
const { handleIdentityKilledSlash } = require("./identity/killedSlash");
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

  const inflation = await handleInflation(event, indexer, blockEvents);
  const treasurySlash = await handleTreasurySlash(event, indexer, blockEvents);
  const maybeIdSlash = await handleIdentityKilledSlash(event, indexer, blockEvents);
  const idSlash = maybeIdSlash ? maybeIdSlash.balance : '0';

  return {
    inflation,
    treasurySlash,
    idSlash,
  }
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

  const maybeTransfer = await handleTransfer(event, indexer);
  const transfer = maybeTransfer ? maybeTransfer.balance : '0';

  const maybeDemocracy = await handleCancelProposalSlash(event, indexer, blockEvents);
  const democracySlash = maybeDemocracy ? maybeDemocracy.balance : '0';
  const maybeStaking = await handleSlashEvent(event, indexer);
  const stakingSlash = maybeStaking ? maybeStaking.balance : '0';

  return {
    transfer,
    democracySlash,
    stakingSlash,
  }
}

async function handleEvents(events, extrinsics, blockIndexer) {
  let transfer = 0;
  let inflation = 0;
  let treasurySlash = 0;
  let idSlash = 0;
  let democracySlash = 0;
  let stakingSlash = 0;

  for (let sort = 0; sort < events.length; sort++) {
    const { event, } = events[sort];

    const commonObj = await handleCommon(blockIndexer, event, sort, events);
    transfer = bigAdd(transfer, commonObj.transfer);
    democracySlash = bigAdd(democracySlash, commonObj.democracySlash);
    stakingSlash = bigAdd(stakingSlash, commonObj.stakingSlash);

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    const depositObj = await handleDeposit(blockIndexer, event, sort, events);
    inflation = bigAdd(inflation, depositObj.inflation);
    treasurySlash = bigAdd(treasurySlash, depositObj.treasurySlash);
    idSlash = bigAdd(idSlash, depositObj.idSlash);
  }

  return {
    inflation,
    transfer,
    treasurySlash,
    idSlash,
    democracySlash,
    stakingSlash,
  }
}

module.exports = {
  handleEvents,
}
