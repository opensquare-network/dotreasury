const {
  handleCloseTipExtrinsic,
  handleTipByProxy,
  handleTipByMultiSig,
  handleTip,
} = require("./treasury/tip");
const { handleBountyAcceptCurator } = require("./treasury/bounty");

async function extractExtrinsicBusinessData(normalizedExtrinsic, extrinsic) {
  if (!normalizedExtrinsic.isSuccess) {
    return;
  }

  await handleCloseTipExtrinsic(normalizedExtrinsic);
  await handleTip(normalizedExtrinsic);
  await handleTipByProxy(normalizedExtrinsic, extrinsic);
  await handleTipByMultiSig(normalizedExtrinsic, extrinsic);

  await handleBountyAcceptCurator(normalizedExtrinsic);
}

module.exports = {
  extractExtrinsicBusinessData,
};
