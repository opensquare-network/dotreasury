function normalizeTip(tip) {
  return {
    hash: tip.hash,
    proposeTime: tip.indexer.blockTime,
    beneficiary: tip.meta?.who,
    finder: tip.finder,
    finder: Array.isArray(tip.meta?.finder)
      ? tip.meta.finder[0]
      : tip.meta?.finder ?? tip.signer,
    reason: tip.meta?.reasonText,
    latestState: {
      state: tip.state?.state,
      time: tip.state?.indexer.blockTime,
    },
    tipsCount: tip.meta?.tips.length,
    medianValue: tip.medianValue,
  };
}
