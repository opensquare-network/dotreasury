function findRewardFromNextEvent(blockEvents, sort) {
  const nextEvent = blockEvents[sort + 1];
  const { event: { section, method } } = nextEvent;
  if (section !== "blockRewards" || method !== "NewSession") {
    return;
  }

  const eachCollatorReward = nextEvent.event.data[0].toString();
  const totalReward = nextEvent.event.data[1].toString();
  return {
    eachCollatorReward,
    totalReward,
  }
}

module.exports = {
  findRewardFromNextEvent,
}
