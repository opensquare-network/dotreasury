const { handleOthers } = require("./others");
const {
  env: { currentChain },
  utils: { bigAdds, bigAdd, gt },
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
const { handleReferendaSlash } = require("./referenda/referenda");
const { handleFellowshipReferendaSlash } = require("./referenda/fellowship");
const { handleBalancesWithdraw } = require("./deposit");
const { handleBalancesWithdrawWithoutFee } = require("./deposit/withoutFee");
const { handleRollover } = require("./treasury/rollover");
const { handleCentrifugeBlockRewards } = require("./centrifuge/blockRewards");
const BigNumber = require("bignumber.js");
const { handleCentrifugeTxFee } = require("./centrifuge/txFee");
const { handleBalancesMinted } = require("./centrifuge/minted");

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
  const maybeReferendaSlash = await handleReferendaSlash(event, indexer, blockEvents);
  const referendaSlash = maybeReferendaSlash ? maybeReferendaSlash.balance : '0';
  const maybeFellowshipReferenda = await handleFellowshipReferendaSlash(event, indexer, blockEvents);
  const fellowshipReferendaSlash = maybeFellowshipReferenda ? maybeFellowshipReferenda.balance : '0';

  const items = {
    inflation,
    treasurySlash,
    idSlash,
    electionSlash,
    stakingSlash,
    democracySlash,
    referendaSlash,
    fellowshipReferendaSlash,
  }

  if ("centrifuge" === currentChain()) {
    const maybeCentrifugeBlockRewards = await handleCentrifugeBlockRewards(event, indexer, blockEvents);
    const centrifugeBlockRewards = maybeCentrifugeBlockRewards?.balance || "0";
    Object.assign(items, { centrifugeBlockRewards });

    const maybeCentrifugeTxFee = await handleCentrifugeTxFee(event, indexer, blockEvents);
    const centrifugeTxFee = maybeCentrifugeTxFee?.balance || "0";
    Object.assign(items, { centrifugeTxFee });
  }
  const sum = bigAdds(Object.values(items));

  let others = 0;
  if (new BigNumber(sum).isLessThanOrEqualTo(0)) {
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
  blockEvents = [],
) {
  const maybeTransfer = await handleTransfer(event, indexer);
  let transfer = maybeTransfer ? maybeTransfer.balance : '0';
  const maybeWithdraw = await handleBalancesWithdraw(event, indexer, blockEvents);
  if (maybeWithdraw) {
    transfer = bigAdd(transfer, maybeWithdraw.balance);
  }
  const maybeWithdrawWithoutFee = await handleBalancesWithdrawWithoutFee(event, indexer, blockEvents);
  if (maybeWithdrawWithoutFee) {
    transfer = bigAdd(transfer, maybeWithdrawWithoutFee.balance);
  }

  return {
    transfer,
    cfgMinted: await handleBalancesMinted(event, indexer, blockEvents),
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
  let referendaSlash = 0;
  let fellowshipReferendaSlash = 0;
  let centrifugeBlockReward = 0;
  let centrifugeTxFee = 0;
  let others = 0;

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    const indexer = {
      ...blockIndexer,
      extrinsicIndex: phase.isNone ? undefined : phase.value.toNumber(),
      eventIndex: sort,
    };

    const { section, method } = event;
    if (section === Modules.Treasury && "Rollover" === method) {
      await handleRollover(event, indexer);
    }

    const commonObj = await handleCommon(indexer, event, events);
    transfer = bigAdd(transfer, commonObj.transfer);
    centrifugeBlockReward = bigAdd(centrifugeBlockReward, commonObj.cfgMinted || 0);

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
    referendaSlash = bigAdd(referendaSlash, depositObj.referendaSlash);
    fellowshipReferendaSlash = bigAdd(fellowshipReferendaSlash, depositObj.fellowshipReferendaSlash);
    centrifugeBlockReward = bigAdd(centrifugeBlockReward, depositObj.centrifugeBlockRewards || 0);
    centrifugeTxFee = bigAdd(centrifugeTxFee, depositObj.centrifugeTxFee || 0);
    others = bigAdd(others, depositObj.others);
  }

  const result = {
    inflation,
    transfer,
    others,
    treasurySlash,
    idSlash,
    democracySlash,
    stakingSlash,
    electionSlash,
    referendaSlash,
    fellowshipReferendaSlash,
  }

  if ("centrifuge" === currentChain()) {
    Object.assign(result, { centrifugeBlockReward, centrifugeTxFee });
  }

  return result;
}

module.exports = {
  handleEvents,
}
