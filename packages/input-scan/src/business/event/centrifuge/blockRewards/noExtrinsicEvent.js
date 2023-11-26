function findRewardFromNoExtrinsicEvents(blockEvents, sort) {
  const noExtrinsicEvents = blockEvents.filter((e, index) => e.phase.isNone && index > sort);
  const targetEvent = noExtrinsicEvents.find(({ event }) => {
    const { section, method } = event;
    return section === "blockRewards" && method === "NewSession";
  });
  if (!targetEvent) {
    return;
  }

  const eachCollatorReward = targetEvent.event.data[0].toString();
  const totalReward = targetEvent.event.data[1].toString();
  return {
    eachCollatorReward,
    totalReward,
  }
}

module.exports = {
  findRewardFromNoExtrinsicEvents,
}
