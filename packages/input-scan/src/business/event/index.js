const { handleOthers } = require("./others");
const {
  utils: { bigAdds, bigAdd },
  consts: {
    Modules,
    TreasuryCommonEvent,
  }
} = require("@osn/scan-common");
const { handleElection } = require("./election");
const { handleStakingSlash } = require("./staking/slash");
const { handleCancelProposalSlash } = require("./democracy/cancelProposal");
const { handleIdentityKilledSlash } = require("./identity/killedSlash");
const { handleTransfer } = require("./transfer");
const { handleTreasurySlash } = require("./treasury");
const { handleInflation } = require("./staking/inflation");

async function handleDeposit(
  indexer,
  event,
  eventSort,
  blockEvents,
) {
  const inflation = await handleInflation(event, indexer, blockEvents);
  const treasurySlash = await handleTreasurySlash(event, indexer, blockEvents);
  const maybeIdSlash = await handleIdentityKilledSlash(event, indexer, blockEvents);
  const idSlash = maybeIdSlash ? maybeIdSlash.balance : '0';
  const electionSlash = await handleElection(event, indexer, blockEvents);
  const stakingSlash = await handleStakingSlash(event, indexer, blockEvents);
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
  indexer,
  event,
  eventSort,
) {
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
    const { event, phase } = events[sort];

    const indexer = {
      ...blockIndexer,
      extrinsicIndex: phase.isNull ? undefined : phase.value.toNumber(),
      eventIndex: sort,
    };

    const commonObj = await handleCommon(indexer, event, sort, events);
    transfer = bigAdd(transfer, commonObj.transfer);

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    const depositObj = await handleDeposit(indexer, event, sort, events);
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
