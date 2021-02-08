require("dotenv").config();
const { updateHeight, getLatestHeight } = require("../chain/latestHead");
const {
  getIncomeNextScanStatus,
  updateIncomeScanStatus,
} = require("../mongo/scanHeight");
const { sleep, incomeLogger } = require("../utils");
const { getApi } = require("../api");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { Modules, TreasuryEvent } = require("../utils/constants");
const { handleStakingSlash } = require("./slash/stakingSlash");
const {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
} = require("./slash/treasurySlash");
const { handleStakingEraPayout } = require("./inflation");
const { handleIdentitySlash } = require("./slash/identitySlash");
const {
  handleDemocracyBacklistedOrPreimageInvalid,
  handleDemocracyCancelProposalSlash,
} = require("./slash/democracySlash");
const {
  handleElectionsPhragmenSlash,
} = require("./slash/electioinsPhragmenSlash");

async function scanIncome() {
  await updateHeight();
  let { height: scanHeight, seats } = await getIncomeNextScanStatus();

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

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

  for (let sort = 0; sort < events.length; sort++) {
    let isGas = true;

    const {
      event: { section, method, data: treasuryDepositData },
      phase,
    } = events[sort];
    if (Modules.Treasury !== section || TreasuryEvent.Deposit !== method) {
      continue;
    }

    const eraPayout = await handleStakingEraPayout(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (eraPayout) {
      inflationInc += eraPayout.balance;
      isGas = false;
    }

    const stakingSlash = await handleStakingSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (stakingSlash) {
      slashInc += stakingSlash.balance;
      isGas = false;
    }

    const treasuryProposalSlash = await handleTreasuryProposalSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (treasuryProposalSlash) {
      slashInc += treasuryProposalSlash.balance;
      isGas = false;
    }

    const treasuryBountyRejectedSlash = await handleTreasuryBountyRejectedSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (treasuryBountyRejectedSlash) {
      slashInc += treasuryBountyRejectedSlash.balance;
      isGas = false;
    }

    const identitySlash = await handleIdentitySlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (identitySlash) {
      slashInc += identitySlash.balance;
      isGas = false;
    }

    const democracySlash = await handleDemocracyBacklistedOrPreimageInvalid(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (democracySlash) {
      slashInc += democracySlash.balance;
      isGas = false;
    }

    const electionSlash = await handleElectionsPhragmenSlash(
      events[sort],
      sort,
      events,
      blockIndexer
    );
    if (electionSlash) {
      slashInc += electionSlash.balance;
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
        slashInc += bountyUnassignCuratorSlash.balance;
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
        slashInc += democracyCancelProposalSlash.balance;
        isGas = false;
      }
    }

    if (isGas) {
      const treasuryDepositEventData = treasuryDepositData.toJSON();
      const balance = (treasuryDepositEventData || [])[0];
      gasInc += balance;
    }
  }

  return {
    inflation: seats.inflation + inflationInc,
    slash: seats.slash + slashInc,
    gas: seats.gas + gasInc,
  };
}

scanIncome().catch(console.error);
// (async function f() {
//   await scanBlockTreasuryIncomeByHeight(6062400);
// })();
