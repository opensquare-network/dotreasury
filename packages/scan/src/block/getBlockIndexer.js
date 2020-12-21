const extractBlockTime = require("./extractBlockTime");

function getBlockIndexer(block) {
  const blockHash = block.hash.toHex();
  const blockHeight = block.header.number.toNumber();
  const blockTime = extractBlockTime(block.extrinsics);

  return {
    blockHeight,
    blockHash,
    blockTime,
  };
}

module.exports = {
  getBlockIndexer,
};
