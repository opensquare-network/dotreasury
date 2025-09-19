const isNil = require("lodash.isnil");
const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  consts: {
    Modules,
    StakingEvents,
    TreasuryCommonEvent,
    KsmTreasuryAccount,
    DotTreasuryAccount,
  },
} = require("@osn/scan-common");

const SessionEvents = Object.freeze({
  NewSession: "NewSession",
});

function isBalancesIssued(section, method) {
  return Modules.Balances === section && "Issued" === method;
}

function isBalancesDeposit(section, method) {
  return Modules.Balances === section && "Deposit" === method;
}

function isEraPaid(section, method) {
  return section === Modules.Staking && method === StakingEvents.EraPaid;
}

function isSessionNewSession(section, method) {
  return section === Modules.Session && method === SessionEvents.NewSession;
}

function isTreasuryUpdatedInactive(section, method) {
  return (
    section === Modules.Treasury &&
    method === TreasuryCommonEvent.UpdatedInactive
  );
}

function isHistoricalEvent(section, method) {
  return section === "historical";
}

function getEventSectionMethod(event) {
  const {
    event: { section, method },
  } = event;
  return { section, method };
}

function checkIsEraPaid(sort, blockEvents) {
  if (sort < 1) {
    return false;
  }

  const { section: preSection, method: preMethod } = getEventSectionMethod(
    blockEvents[sort - 1],
  );

  if (isEraPaid(preSection, preMethod)) {
    return true;
  }

  if (sort < 2) {
    return false;
  }

  const { section: prePreSection, method: prePreMethod } =
    getEventSectionMethod(blockEvents[sort - 2]);

  if (
    isBalancesDeposit(preSection, preMethod) &&
    isEraPaid(prePreSection, prePreMethod)
  ) {
    return true;
  }

  if (sort < 3) {
    return false;
  }

  const { section: prePrePreSection, method: prePrePreMethod } =
    getEventSectionMethod(blockEvents[sort - 3]);

  if (
    isBalancesDeposit(preSection, preMethod) &&
    isBalancesIssued(prePreSection, prePreMethod) &&
    isEraPaid(prePrePreSection, prePrePreMethod)
  ) {
    return true;
  }

  return false;
}

async function handleEraPaid(event, indexer, blockEvents) {
  if (!isNil(indexer.extrinsicIndex)) {
    return;
  }

  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  const isInflation = checkIsEraPaid(sort, blockEvents);
  if (!isInflation) {
    return;
  }

  const balance = event.data[0].toString();

  const obj = {
    indexer,
    balance,
    section: Modules.Staking,
    method: StakingEvents.EraPaid,
  };
  const col = await getIncomeInflationCollection();
  await col.insertOne(obj);
  return obj;
}

async function handleEraPaidWithoutTreasuryDeposit(
  event,
  indexer,
  blockEvents,
) {
  if (!isNil(indexer.extrinsicIndex)) {
    return;
  }

  const sort = indexer.eventIndex;
  if (sort + 4 > blockEvents.length - 1) {
    return;
  }

  const { section: next1Section, method: next1Method } = getEventSectionMethod(
    blockEvents[sort + 1],
  );
  const { section: next2Section, method: next2Method } = getEventSectionMethod(
    blockEvents[sort + 2],
  );

  if (
    !isBalancesIssued(next1Section, next1Method) ||
    !isBalancesDeposit(next2Section, next2Method)
  ) {
    return;
  }

  // Skip historical events
  let skips = 0;
  while (true) {
    const { section, method } = getEventSectionMethod(
      blockEvents[sort + 3 + skips],
    );
    if (isHistoricalEvent(section, method)) {
      skips++;
      continue;
    }
    break;
  }

  const { section: next3Section, method: next3Method } = getEventSectionMethod(
    blockEvents[sort + 3 + skips],
  );
  const { section: next4Section, method: next4Method } = getEventSectionMethod(
    blockEvents[sort + 4 + skips],
  );

  const isInflation =
    isSessionNewSession(next3Section, next3Method) &&
    isTreasuryUpdatedInactive(next4Section, next4Method);
  if (!isInflation) {
    return;
  }

  const balanceDepositEvent = blockEvents[sort + 2];
  const who = balanceDepositEvent.event.data[0].toString();
  const balance = balanceDepositEvent.event.data[1].toString();

  if (![KsmTreasuryAccount, DotTreasuryAccount].includes(who)) {
    return;
  }

  const obj = {
    indexer,
    balance,
    section: Modules.Staking,
    method: StakingEvents.EraPaid,
  };
  const col = await getIncomeInflationCollection();
  await col.insertOne(obj);

  return balance;
}

module.exports = {
  handleEraPaid,
  handleEraPaidWithoutTreasuryDeposit,
};
