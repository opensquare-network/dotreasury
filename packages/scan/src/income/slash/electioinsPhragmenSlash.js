const {
  Modules,
  ElectionsPhragmenEvents,
  TreasuryEvent,
} = require("../../utils/constants");
const { getElectionSlashCollection } = require("../../mongo");

function allBeforeIsDeposit(allBlockEvents, sort) {
  let i = sort - 1;
  while (i >= 0) {
    const {
      event: { section, method },
    } = allBlockEvents[i];
    if (section !== Modules.Treasury || method !== TreasuryEvent.Deposit) {
      return false;
    }

    i--;
  }

  return true;
}

async function saveSlashRecord(data) {
  const col = await getElectionSlashCollection();
  await col.insertOne(data);
}

function nextDifferentIsNewTerm(allBlockEvents, sort) {
  let i = sort + 1;
  while (i < allBlockEvents.length) {
    const {
      event: { section, method },
    } = allBlockEvents[i];

    const notDeposit =
      section !== Modules.Treasury || method !== TreasuryEvent.Deposit;
    const notNewTerm =
      section !== Modules.ElectionsPhragmen ||
      method !== ElectionsPhragmenEvents.NewTerm;

    if (!notDeposit) {
      i++;
      continue;
    }

    if (notDeposit && notNewTerm) {
      return false;
    }

    if (!notNewTerm) {
      return true;
    }
  }

  return false;
}

async function handleElectionsLoserCandidateSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  if (!nextDifferentIsNewTerm(allBlockEvents, sort)) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    eventSort: sort,
    section: Modules.ElectionsPhragmen,
    method: ElectionsPhragmenEvents.NewTerm,
    balance,
    treasuryDepositEventData,
  };

  await saveSlashRecord(data);

  return data;
}

async function handleElectionsPhragmenSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.ElectionsPhragmen ||
    ![
      ElectionsPhragmenEvents.CandidateSlashed,
      ElectionsPhragmenEvents.SeatHolderSlashed,
    ].includes(method)
  ) {
    return;
  }

  const nextEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const key =
    ElectionsPhragmenEvents.CandidateSlashed === method
      ? "candidateSlashedEventData"
      : "seatHolderSlashedEventData";

  const data = {
    indexer: blockIndexer,
    eventSort: sort,
    section,
    method,
    balance,
    treasuryDepositEventData,
    [key]: nextEventData,
  };
  await saveSlashRecord(data);
  return data;
}

module.exports = {
  handleElectionsPhragmenSlash,
  handleElectionsLoserCandidateSlash,
};
