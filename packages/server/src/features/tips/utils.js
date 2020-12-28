function normalizeTip(tipInDb) {
  return {
    hash: tipInDb.hash,
    proposeTime: tipInDb.indexer.blockTime,
    proposeAtBlockHeight: tipInDb.indexer.blockHeight,
    beneficiary: tipInDb.meta?.who,
    finder: tipInDb.finder,
    reason: tipInDb.reason,
    latestState: {
      state: tipInDb.state?.state,
      time: tipInDb.state?.indexer.blockTime,
    },
    tipsCount: tipInDb.meta?.tips.length,
    medianValue: tipInDb.medianValue,
  };
}

module.exports = {
  normalizeTip,
};
