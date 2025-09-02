export default function convertProposals(data = []) {
  return data.map((item) => ({
    ...item,
    description: item?.title || `Treasury proposal #${item?.proposalIndex}`,
    proposeTime: item?.indexer?.blockTime,
    links: item?.links || [],
    latestState: {
      state: item?.state,
      time: item?.onchainData?.state?.indexer?.blockTime,
    },
    proposeAtBlockHeight: item?.indexer?.blockHeight,
    trackInfo: item?.onchainData?.track,
    value: item?.onchainData?.value,
    symbolPrice: item?.onchainData?.price?.submission,
  }));
}
