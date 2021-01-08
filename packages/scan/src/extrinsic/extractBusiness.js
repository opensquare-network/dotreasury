const {
  handleCloseTipExtrinsic,
  handleTipByProxy,
  handleTipByMultiSig,
  handleTip,
} = require("./treasury/tip");

async function extractExtrinsicBusinessData(normalizedExtrinsic, extrinsic) {
  if (!normalizedExtrinsic.isSuccess) {
    return;
  }

  await handleCloseTipExtrinsic(normalizedExtrinsic);
  await handleTip(normalizedExtrinsic);
  await handleTipByProxy(normalizedExtrinsic, extrinsic);
  await handleTipByMultiSig(normalizedExtrinsic, extrinsic);
  // await handleBountyExtrinsic(section, name, args, isSuccess, indexer, events);
}

module.exports = {
  extractExtrinsicBusinessData,
};
