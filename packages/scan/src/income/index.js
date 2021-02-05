require("dotenv").config();
const { updateHeight, getLatestHeight } = require("../chain/latestHead");
const {
  getIncomeNextScanHeight,
  updateIncomeScanHeight,
} = require("../mongo/scanHeight");
const { sleep } = require("../utils");
const { getApi } = require("../api");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { Modules, TreasuryEvent, StakingEvents } = require("../utils/constants");
const { handleStakingSlash } = require("./slash/stakingSlash");
const {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
} = require("./slash/treasurySlash");

async function scanIncome() {
  await updateHeight();

  while (true) {
    const chainHeight = getLatestHeight();
    let scanHeight = await getIncomeNextScanHeight();

    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    await updateIncomeScanHeight(scanHeight++);
  }
}

async function scanBlockTreasuryIncomeByHeight(scanHeight) {
  const api = await getApi();

  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);
  await handleEvents(allEvents, blockIndexer, block.block.extrinsics);
}

async function handleEvents(events, blockIndexer, extrinsics) {
  for (let sort = 0; sort < events.length; sort++) {
    const {
      event: { section, method, data },
      phase,
    } = events[sort];
    if (Modules.Treasury !== section || TreasuryEvent.Deposit !== method) {
      continue;
    }

    await handleStakingEraPayout(events[sort], sort, events, blockIndexer);
    await handleStakingSlash(events[sort], sort, events, blockIndexer);
    await handleTreasuryProposalSlash(events[sort], sort, events, blockIndexer);

    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsicIndexer = {
        ...blockIndexer,
        extrinsicIndex: phaseValue,
      };
      const extrinsic = extrinsics[phaseValue];

      await handleTreasuryBountyUnassignCuratorSlash(
        events[sort],
        sort,
        events,
        extrinsicIndexer,
        extrinsic
      );
    }
  }
}

// Inflation
function handleStakingEraPayout(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort <= 0 || !phase.isNull) {
    return;
  }

  const preEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method, data: eraPayoutData },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.EraPayout) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const eraPayoutEventData = eraPayoutData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    balance,
    treasuryDepositEventData,
    eraPayoutEventData,
  };
  // TODO: insert data to MongoDB
}

(async function f() {
  await scanBlockTreasuryIncomeByHeight(6006979);
})();
