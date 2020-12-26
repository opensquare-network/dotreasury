function normalizeTip(tipInDb) {
  return {
    hash: tipInDb.hash,
    proposeTime: tipInDb.indexer.blockTime,
    beneficiary: tipInDb.meta?.who,
    finder: Array.isArray(tipInDb.meta?.finder)
      ? tipInDb.meta.finder[0]
      : tipInDb.meta?.finder ?? tipInDb.signer,
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
