const { extractExtrinsicEvents, getExtrinsicSigner } = require("../utils");
const { isExtrinsicSuccess } = require("../utils");
const { calcMultisigAddress } = require("../utils/call");
const { u8aToHex } = require("@polkadot/util");
const { handleTipCall, handleTipCloseCall } = require("./treasury/tip");
const { handleBountyAcceptCurator } = require("./treasury/bounty");
const { GenericCall } = require("@polkadot/types");
const { Modules, ProxyMethods, UtilityMethods } = require("../utils/constants");

async function handleCall(call, author, extrinsicIndexer) {
  await handleTipCall(...arguments);
  await handleTipCloseCall(...arguments);
}

async function unwrapProxy(call, signer, extrinsicIndexer) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  if (
    Modules.Utility === innerCall.section &&
    UtilityMethods.batch === innerCall.method
  ) {
    await unwrapBatch(innerCall, real, extrinsicIndexer);
  } else {
    await handleCall(innerCall, real, extrinsicIndexer);
  }
}

async function handleMultisig(call, signer, extrinsicIndexer) {
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    call.registry.ss58Prefix
  );

  const innerCall = new GenericCall(call.registry, callHex);
  if (
    Modules.Proxy === innerCall.section &&
    ProxyMethods.proxy === innerCall.method
  ) {
    await unwrapProxy(innerCall, multisigAddr, extrinsicIndexer);
  } else {
    await handleCall(innerCall, multisigAddr, extrinsicIndexer);
  }
}

async function unwrapBatch(call, signer, extrinsicIndexer) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    // TODO: here we didn't handle proxy&batch extrinsic in batch
    await handleCall(innerCall, signer, extrinsicIndexer);
  }
}

async function handleCallInExtrinsic(call, signer, extrinsicIndexer) {
  const { section, method } = call;

  if ("proxy" === section && "proxy" === method) {
    await unwrapProxy(call, signer, extrinsicIndexer);
  } else if ("multisig" === section && "asMulti" === method) {
    await handleMultisig(call, signer, extrinsicIndexer);
  } else if ("utility" === section && "batch" === method) {
    await unwrapBatch(call, signer, extrinsicIndexer);
  }

  await handleCall(call, signer, extrinsicIndexer);
}

async function extractAndHandleCall(extrinsic, events = [], extrinsicIndexer) {
  const signer = extrinsic._raw.signature.signer.toString();
  const call = extrinsic.method;

  await handleCallInExtrinsic(call, signer, extrinsicIndexer);
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

    const normalizedExtrinsic = {
      ...normalized,
      extrinsicIndexer,
    };

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
