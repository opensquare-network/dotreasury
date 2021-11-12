const { handleOthers } = require("./others");
const { bigAdds } = require("../../utils");
const { handleElection } = require("./election");
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
  const electionSlash = await handleElection(event, indexer, blockEvents);
  const maybeStaking = await handleSlashEvent(event, indexer, blockEvents);
  const stakingSlash = maybeStaking ? maybeStaking.balance : '0';
  const maybeDemocracy = await handleCancelProposalSlash(event, indexer, blockEvents);
  const democracySlash = maybeDemocracy ? maybeDemocracy.balance : '0';

  const items = {
    inflation,
    treasurySlash,
    idSlash,
    electionSlash,
    stakingSlash,
    democracySlash,
  }
  const sum = bigAdds(Object.values(items));

  let others = 0;
  if (parseInt(sum) <= 0) {
    const othersObj = await handleOthers(event, indexer);
    others = othersObj.balance;
  }

  return {
    ...items,
    others,
  }
}

async function handleCommon(
  blockIndexer,
  event,
  eventSort,
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  const maybeTransfer = await handleTransfer(event, indexer);
  const transfer = maybeTransfer ? maybeTransfer.balance : '0';

  return {
    transfer,
  }
}

async function handleEvents(events, extrinsics, blockIndexer) {
  let transfer = 0;
  let inflation = 0;
  let treasurySlash = 0;
  let idSlash = 0;
  let democracySlash = 0;
  let stakingSlash = 0;
  let electionSlash = 0;
  let others = 0;

  for (let sort = 0; sort < events.length; sort++) {
    const { event, } = events[sort];

    const commonObj = await handleCommon(blockIndexer, event, sort, events);
    transfer = bigAdd(transfer, commonObj.transfer);

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    const depositObj = await handleDeposit(blockIndexer, event, sort, events);
    inflation = bigAdd(inflation, depositObj.inflation);
    treasurySlash = bigAdd(treasurySlash, depositObj.treasurySlash);
    idSlash = bigAdd(idSlash, depositObj.idSlash);
    electionSlash = bigAdd(electionSlash, depositObj.electionSlash);
    democracySlash = bigAdd(democracySlash, depositObj.democracySlash);
    stakingSlash = bigAdd(stakingSlash, depositObj.stakingSlash);
    others = bigAdd(others, depositObj.others);
  }

  return {
    inflation,
    transfer,
    others,
    treasurySlash,
    idSlash,
    democracySlash,
    stakingSlash,
    electionSlash,
  }
}

module.exports = {
  handleEvents,
}
