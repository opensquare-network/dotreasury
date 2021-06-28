const { extractExtrinsicEvents, getExtrinsicSigner } = require("../utils");
const { isExtrinsicSuccess } = require("../utils");
const { u8aToHex } = require("@polkadot/util");
const {
  handleCloseTipExtrinsic,
  handleTipByProxy,
  handleTipByMultiSig,
  handleTip,
  handleTipByBatch,
} = require("./treasury/tip");
const { handleBountyAcceptCurator } = require("./treasury/bounty");

async function handleExtrinsics(extrinsics = [], allEvents = [], indexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    const normalized = normalizeExtrinsic(extrinsic, events);
    const extrinsicIndexer = {
      ...indexer,
      index: index++,
    };

    if (!normalized.isSuccess) {
      continue;
    }

    const normalizedExtrinsic = {
      ...normalized,
      extrinsicIndexer,
    };

    await handleCloseTipExtrinsic(normalizedExtrinsic);
    await handleTip(normalizedExtrinsic);
    await handleTipByProxy(normalizedExtrinsic, extrinsic);
    await handleTipByMultiSig(normalizedExtrinsic, extrinsic);
    await handleTipByBatch(normalizedExtrinsic, extrinsic);

    await handleBountyAcceptCurator(normalizedExtrinsic, extrinsic);
  }
}

function normalizeExtrinsic(extrinsic, events) {
  if (!extrinsic) {
    throw new Error("Invalid extrinsic object");
  }

  const hash = extrinsic.hash.toHex();
  const callIndex = u8aToHex(extrinsic.callIndex);
  const { args } = extrinsic.method.toJSON();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;
  const signer = getExtrinsicSigner(extrinsic);

  const isSuccess = isExtrinsicSuccess(events);

  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据

  return {
    hash,
    signer,
    section,
    name,
    callIndex,
    version,
    args,
    data,
    isSuccess,
  };
}

module.exports = {
  handleExtrinsics,
  normalizeExtrinsic,
};
