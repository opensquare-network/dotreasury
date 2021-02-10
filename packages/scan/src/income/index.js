require("dotenv").config();
const { updateHeight, getLatestHeight } = require("../chain/latestHead");
const {
  getIncomeNextScanStatus,
  updateIncomeScanStatus,
} = require("../mongo/scanHeight");
const {
  sleep,
  incomeLogger,
  bigAdd,
  incomeKnownHeightsLogger: heightsLogger,
  gt,
} = require("../utils");
const { abnormalGasLogger } = require("../utils/logger");
const { getApi } = require("../api");
const { getBlockIndexer } = require("../block/getBlockIndexer");
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
const { knownHeights, maxKnownHeight } = require("./known");

const tooMuchGas = 0.1 * Math.pow(10, 12);

async function scanKnowBlocks(toScanHeight) {
  let index = knownHeights.findIndex((height) => height >= toScanHeight);
  while (index < knownHeights.length) {
    const height = knownHeights[index];

    let { seats } = await getIncomeNextScanStatus();
    const newSeats = await scanBlockTreasuryIncomeByHeight(height, seats);

    incomeLogger.info(`block ${height} done`);
    await updateIncomeScanStatus(height, newSeats);
    index++;
  }
}

async function scanIncome() {
  await updateHeight();
  let { height: scanHeight } = await getIncomeNextScanStatus();

  const useKnowHeights = !!process.env.USE_INCOME_KNOWN_HEIGHT;
  if (scanHeight <= maxKnownHeight && useKnowHeights) {
    await scanKnowBlocks(scanHeight);
    scanHeight = maxKnownHeight + 1;
  }

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    let { seats } = await getIncomeNextScanStatus();
    const newSeats = await scanBlockTreasuryIncomeByHeight(scanHeight, seats);
    incomeLogger.info(`block ${scanHeight} done`);
    await updateIncomeScanStatus(scanHeight++, newSeats);
  }
}

async function scanBlockTreasuryIncomeByHeight(scanHeight, seats) {
  const api = await getApi();

  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);
  return await handleEvents(
    allEvents,
    blockIndexer,
    block.block.extrinsics,
    seats
  );
}

async function handleEvents(events, blockIndexer, extrinsics, seats) {
  let inflationInc = 0;
  let slashInc = 0;
  let gasInc = 0;

  // slash increments
  let treasurySlashInc = 0;
  let stakingSlashInc = 0;
  let democracySlashInc = 0;
  let electionsPhragmenSlashInc = 0;
  let identitySlashInc = 0;

  let hasDeposit = false;

  for (let sort = 0; sort < events.length; sort++) {
    let isGas = true;

    const {
      event: { section, method, data: treasuryDepositData },
      phase,
    } = events[sort];
    if (Modules.Treasury !== section || TreasuryEvent.Deposit !== method) {
      continue;
    }

    hasDeposit = true;

    const eraPayout = await handleStakingEraPayout(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (eraPayout) {
      inflationInc = bigAdd(inflationInc, eraPayout.balance);
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
      isGas = false;
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
        isGas = false;
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
        isGas = false;
      }
    }

    if (isGas) {
      const treasuryDepositEventData = treasuryDepositData.toJSON();
      const balance = (treasuryDepositEventData || [])[0];
      gasInc = bigAdd(gasInc, balance);
      if (gt(balance, tooMuchGas)) {
        abnormalGasLogger.info(blockIndexer.blockHeight, balance);
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
    gas: bigAdd(seats.gas, gasInc),
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

scanIncome().catch(console.error);
// (async function f() {
//   await scanBlockTreasuryIncomeByHeight(10800, {
//     inflation: 0,
//     slash: 0,
//     gas: 0,
//     slashSeats: {
//       treasury: 0,
//       staking: 0,
//       democracy: 0,
//       electionsPhragmen: 0,
//       identity: 0,
//     },
//   });
// })();
