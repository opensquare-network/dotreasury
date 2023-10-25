const { getCfgBlockRewardCol } = require("../../../../mongo/data");

function extractCollatorRewardInfo(blockEvents, treasuryDepositSort) {
  const groupRewardedEvent = blockEvents[treasuryDepositSort - 2];
  if (!groupRewardedEvent) {
    return null;
  }

  const groupId = groupRewardedEvent.event.data[0].toNumber();
  const totalCollatorReward = groupRewardedEvent.event.data[1].toString();

  return {
    groupId,
    totalCollatorReward,
  };
}

async function handleCentrifugeBlockRewards(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const { event: { section, method } } = nextEvent;
  if (section !== "blockRewards" || method !== "NewSession") {
    return;
  }

  const balance = event.data[0].toString();
  const eachCollatorReward = nextEvent.event.data[0].toString();
  const totalReward = nextEvent.event.data[1].toString();

  const collatorRewardInfo = extractCollatorRewardInfo(blockEvents, sort);
  if (!collatorRewardInfo) {
    throw new Error(`Can not get centrifuge collator reward info at ${ indexer.blockHeight }`);
  }

  const obj = {
    indexer,
    section,
    method,
    balance,
    totalReward,
    eachCollatorReward,
    ...collatorRewardInfo,
  }

  const col = await getCfgBlockRewardCol();
  await col.insertOne(obj);

  return obj;
}

module.exports = {
  handleCentrifugeBlockRewards,
}
