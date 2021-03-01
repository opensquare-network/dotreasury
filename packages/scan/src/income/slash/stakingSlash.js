const { Modules, StakingEvents } = require("../../utils/constants");
const { stakingSlashLogger } = require("../../utils/logger");
const { getStakingSlashCollection } = require("../../mongo");

async function handleStakingSlash(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort <= 0) {
    return;
  }

  const preEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.Slash) {
    return;
  }

  const slashRecords = [];
  let iter = sort - 1;
  do {
    const {
      event: { section, method },
    } = allBlockEvents[iter];
    if (section !== Modules.Staking || method !== StakingEvents.Slash) {
      break;
    }

    slashRecords.push(preEvent.event.data.toJSON());
    iter--;
  } while (iter >= 0);

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    eventSort: sort,
    section,
    method,
    balance,
    treasuryDepositEventData,
    slashRecords,
  };

  const col = await getStakingSlashCollection();
  await col.insertOne(data);

  stakingSlashLogger.info(blockIndexer.blockHeight, method);
  return data;
}

module.exports = {
  handleStakingSlash,
};
