const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  consts: { Modules, StakingEvents, SessionEvents },
} = require("@osn/scan-common");

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
  if (typeof indexer.extrinsicIndex !== "undefined") {
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
  if (typeof indexer.extrinsicIndex !== "undefined") {
    return;
  }

  const sort = indexer.eventIndex;
  if (sort < 4) {
    return;
  }

  const { section: pre1Section, method: pre1Method } = getEventSectionMethod(
    blockEvents[sort - 1],
  );
  const { section: pre2Section, method: pre2Method } = getEventSectionMethod(
    blockEvents[sort - 2],
  );
  const { section: pre3Section, method: pre3Method } = getEventSectionMethod(
    blockEvents[sort - 3],
  );
  const { section: pre4Section, method: pre4Method } = getEventSectionMethod(
    blockEvents[sort - 4],
  );

  const isInflation =
    isSessionNewSession(pre1Section, pre1Method) &&
    isBalancesDeposit(pre2Section, pre2Method) &&
    isBalancesIssued(pre3Section, pre3Method) &&
    isEraPaid(pre4Section, pre4Method);
  if (!isInflation) {
    return;
  }

  const balanceDepositEvent = blockEvents[sort - 2];
  const balance = balanceDepositEvent.event.data[1].toString();

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
