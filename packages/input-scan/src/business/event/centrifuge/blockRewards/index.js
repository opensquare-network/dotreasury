const { getCfgBlockRewardCol } = require("../../../../mongo/data");
const { findRewardFromNextEvent } = require("./nextEvent");
const { findRewardFromNoExtrinsicEvents } = require("./noExtrinsicEvent");

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

  let rewardInfo = findRewardFromNextEvent(blockEvents, sort);
  if (!rewardInfo) {
    rewardInfo = findRewardFromNoExtrinsicEvents(blockEvents, sort);
  }
  if (!rewardInfo) {
    return;
  }

  const balance = event.data[0].toString();
  const { eachCollatorReward, totalReward } = rewardInfo;
  const collatorRewardInfo = extractCollatorRewardInfo(blockEvents, sort);
  if (!collatorRewardInfo) {
    throw new Error(`Can not get centrifuge collator reward info at ${ indexer.blockHeight }`);
  }

  const obj = {
    indexer,
    section: "blockRewards",
    method: "NewSession",
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
