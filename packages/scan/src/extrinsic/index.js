const { extractExtrinsicEvents, getExtrinsicSigner } = require("../utils");
const { isExtrinsicSuccess } = require("../utils");
const { calcMultisigAddress } = require("../utils/call");
const { u8aToHex } = require("@polkadot/util");
const { handleTipCall, handleTipCloseCall } = require("./treasury/tip");
const { GenericCall } = require("@polkadot/types");
const {
  Modules,
  ProxyMethods,
  UtilityMethods,
  MultisigMethods,
} = require("../utils/constants");
const { handleAcceptCurator } = require("./treasury/bounty/acceptCurator");
const { logger } = require("../utils/logger");

async function handleCall(call, author, extrinsicIndexer) {
  await handleTipCall(...arguments);
  await handleTipCloseCall(...arguments);
  await handleAcceptCurator(...arguments);
}

async function unwrapProxy(call, signer, extrinsicIndexer) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, extrinsicIndexer);
}

async function handleMultisig(call, signer, extrinsicIndexer) {
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    call.registry.chainSS58
  );

  let innerCall;

  try {
    innerCall = new GenericCall(call.registry, callHex);
  } catch (e) {
    logger.error(`error when parse multiSig`, extrinsicIndexer);
    return;
  }

  await handleWrappedCall(innerCall, multisigAddr, extrinsicIndexer);
}

async function unwrapBatch(call, signer, extrinsicIndexer) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(innerCall, signer, extrinsicIndexer);
  }
}

async function handleWrappedCall(call, signer, extrinsicIndexer) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(call, signer, extrinsicIndexer);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(call, signer, extrinsicIndexer);
  } else if (Modules.Utility === section && UtilityMethods.batch === method) {
    await unwrapBatch(call, signer, extrinsicIndexer);
  }

  await handleCall(call, signer, extrinsicIndexer);
}

async function extractAndHandleCall(extrinsic, events = [], extrinsicIndexer) {
  const signer = extrinsic._raw.signature.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(call, signer, extrinsicIndexer);
}

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

    await extractAndHandleCall(extrinsic, events, extrinsicIndexer);
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
