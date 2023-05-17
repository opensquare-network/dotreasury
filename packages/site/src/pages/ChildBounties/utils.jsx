export function compatChildBountyData(data = {}) {
  return {
    bountyIndex: data.index,
    proposeTime: data.indexer?.blockTime,
    proposeAtBlockHeight: data.indexer?.blockHeight,
    title: data.description,
    ...data,
  };
}
