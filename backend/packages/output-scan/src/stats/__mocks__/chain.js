async function getBlockIndexerByHeight(blockHeight) {
  return {
    blockHeight,
    blockHash: "0x334f49cd193b01644c3db061d6445c6d64a54adb28942936a91657bb46aaaaaa",
    blockTime: Date.now(),
  };
}

module.exports = {
  getBlockIndexerByHeight,
};
