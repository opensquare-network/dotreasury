require("dotenv").config();
const {
  getIncomeNextScanStatus,
  updateIncomeScanStatus,
} = require("../mongo/scanHeight");
const {
  bigAdd,
  incomeKnownHeightsLogger: heightsLogger,
  gt,
} = require("../utils");
const { abnormalOthersLogger } = require("../utils/logger");
const { Modules, TreasuryEvent } = require("../utils/constants");
const { handleStakingSlash } = require("./slash/stakingSlash");
const {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
  handleTipSlash,
} = require("./slash/treasurySlash");
const { handleStakingEraPayout } = require("./inflation");
const { handleIdentitySlash } = require("./slash/identitySlash");
const {
  handleDemocracyBacklistedOrPreimageInvalid,
  handleDemocracyCancelProposalSlash,
} = require("./slash/democracySlash");
const {
  handleElectionsPhragmenSlash,
  handleElectionsLoserCandidateSlash,
} = require("./slash/electioinsPhragmenSlash");
const { getOthersIncomeCollection } = require("../mongo");

async function saveOthersRecord(data) {
  const col = await getOthersIncomeCollection();
  await col.insertOne(data);
}

const tooMuchGas = 0.1 * Math.pow(10, 12);

async function handleIncomeEvents(allEvents, blockIndexer, extrinsics) {
  let { seats } = await getIncomeNextScanStatus();
  const newSeats = await handleEvents(
    allEvents,
    blockIndexer,
    extrinsics,
    seats
  );
  await updateIncomeScanStatus(blockIndexer.blockHeight, newSeats);
  return newSeats;
}

async function handleEvents(events, blockIndexer, extrinsics, seats) {
  let inflationInc = 0;
  let slashInc = 0;
  let othersInc = 0;

  // slash increments
  let treasurySlashInc = 0;
  let stakingSlashInc = 0;
  let democracySlashInc = 0;
  let electionsPhragmenSlashInc = 0;
  let identitySlashInc = 0;

  let hasDeposit = false;

  for (let sort = 0; sort < events.length; sort++) {
    let isOthers = true;

    const {
      event: { section, method, data: treasuryDepositData },
      phase,
    } = events[sort];
    if (Modules.Treasury !== section || TreasuryEvent.Deposit !== method) {
      continue;
    }

    hasDeposit = true;

    const inflation = await handleStakingEraPayout(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (inflation) {
      inflationInc = bigAdd(inflationInc, inflation.balance);
      isOthers = false;
    }

    const stakingSlash = await handleStakingSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (stakingSlash) {
      slashInc = bigAdd(slashInc, stakingSlash.balance);
      stakingSlashInc = bigAdd(stakingSlashInc, stakingSlash.balance);
      isOthers = false;
    }

    const tipSlash = await handleTipSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (tipSlash) {
      slashInc = bigAdd(slashInc, tipSlash.balance);
      treasurySlashInc = bigAdd(treasurySlashInc, tipSlash.balance);
      isOthers = false;
    }

    const treasuryProposalSlash = await handleTreasuryProposalSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (treasuryProposalSlash) {
      slashInc = bigAdd(slashInc, treasuryProposalSlash.balance);
      treasurySlashInc = bigAdd(
        treasurySlashInc,
        treasuryProposalSlash.balance
      );
      isOthers = false;
    }

    const treasuryBountyRejectedSlash = await handleTreasuryBountyRejectedSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (treasuryBountyRejectedSlash) {
      slashInc = bigAdd(slashInc, treasuryBountyRejectedSlash.balance);
      treasurySlashInc = bigAdd(
        treasurySlashInc,
        treasuryBountyRejectedSlash.balance
      );
      isOthers = false;
    }

    const identitySlash = await handleIdentitySlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (identitySlash) {
      slashInc = bigAdd(slashInc, identitySlash.balance);
      identitySlashInc = bigAdd(identitySlashInc, identitySlash.balance);
      isOthers = false;
    }

    const democracySlash = await handleDemocracyBacklistedOrPreimageInvalid(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (democracySlash) {
      slashInc = bigAdd(slashInc, democracySlash.balance);
      democracySlashInc = bigAdd(democracySlashInc, democracySlash.balance);
      isOthers = false;
    }

    const electionSlash = await handleElectionsPhragmenSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (electionSlash) {
      slashInc = bigAdd(slashInc, electionSlash.balance);
      electionsPhragmenSlashInc = bigAdd(
        electionsPhragmenSlashInc,
        electionSlash.balance
      );
      isOthers = false;
    }

    const loserCandidateSlash = await handleElectionsLoserCandidateSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (loserCandidateSlash) {
      slashInc = bigAdd(slashInc, loserCandidateSlash.balance);
      electionsPhragmenSlashInc = bigAdd(
        electionsPhragmenSlashInc,
        loserCandidateSlash.balance
      );
      isOthers = false;
    }

    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsicIndexer = {
        ...blockIndexer,
        extrinsicIndex: phaseValue,
      };
      const extrinsic = extrinsics[phaseValue];

      const bountyUnassignCuratorSlash = await handleTreasuryBountyUnassignCuratorSlash(
        events[sort],
        sort,
        events,
        extrinsicIndexer,
        extrinsic
      );
      if (bountyUnassignCuratorSlash) {
        slashInc = bigAdd(slashInc, bountyUnassignCuratorSlash.balance);
        treasurySlashInc = bigAdd(
          treasurySlashInc,
          bountyUnassignCuratorSlash.balance
        );
        isOthers = false;
      }

      const democracyCancelProposalSlash = await handleDemocracyCancelProposalSlash(
        events[sort],
        sort,
        events,
        extrinsicIndexer,
        extrinsic
      );
      if (democracyCancelProposalSlash) {
        slashInc = bigAdd(slashInc, democracyCancelProposalSlash.balance);
        democracySlashInc = bigAdd(
          slashInc,
          democracyCancelProposalSlash.balance
        );
        isOthers = false;
      }
    }

    if (isOthers) {
      const treasuryDepositEventData = treasuryDepositData.toJSON();
      const balance = (treasuryDepositEventData || [])[0];
      othersInc = bigAdd(othersInc, balance);
      // TODO: Get the treasury address balance and add the imbalance to others
      if (gt(balance, tooMuchGas)) {
        abnormalOthersLogger.info(blockIndexer.blockHeight, balance);

        const data = {
          indexer: blockIndexer,
          eventSort: sort,
          section,
          method,
          balance,
          treasuryDepositEventData,
        };
        await saveOthersRecord(data);
      }
    }
  }

  if (hasDeposit) {
    heightsLogger.info(blockIndexer.blockHeight);
  }

  const slashSeats = seats.slashSeats || {};
  return {
    inflation: bigAdd(seats.inflation, inflationInc),
    slash: bigAdd(seats.slash, slashInc),
    others: bigAdd(seats.others, othersInc),
    slashSeats: {
      treasury: bigAdd(slashSeats.treasury || 0, treasurySlashInc),
      staking: bigAdd(slashSeats.staking || 0, stakingSlashInc),
      democracy: bigAdd(slashSeats.democracy || 0, democracySlashInc),
      electionsPhragmen: bigAdd(
        slashSeats.electionsPhragmen || 0,
        electionsPhragmenSlashInc
      ),
      identity: bigAdd(slashSeats.identity || 0, identitySlashInc),
    },
  };
}

module.exports = {
  handleIncomeEvents,
};
