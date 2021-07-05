function normalizeTip(tipInDb) {
  const tipValue =
    tipInDb.state?.state === "TipClosed" ? tipInDb.state?.data?.[2] : null;

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
    medianValue: tipValue ?? tipInDb.medianValue,
    symbolPrice: tipInDb.symbolPrice,
  };
}

module.exports = {
  normalizeTip,
};
