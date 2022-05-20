const { findInterrupted } = require("./batch/checkInterrupted");
const { WrappedEvents } = require("../../utils/wrappedEvents");
const { handleAcceptCurator } = require("./bounty/acceptCurator");
const { handleCloseTipCall } = require("./tip/close");
const { handleTipCall } = require("./tip/tip");
const { calcMultisigAddress } = require("../../utils/call");
const {
  Modules,
  MultisigMethods,
  ProxyMethods,
  UtilityMethods,
  SudoMethods,
} = require("../common/constants");
const { GenericCall } = require("@polkadot/types");
const {
  logger,
  specs: { findRegistry },
  utils: { extractExtrinsicEvents, isExtrinsicSuccess }
} = require("@dotreasury/common")

async function handleCall(call, author, extrinsicIndexer, wrappedEvents) {
  await handleTipCall(call, author, extrinsicIndexer, wrappedEvents);
  await handleCloseTipCall(call, author, extrinsicIndexer, wrappedEvents);
  await handleAcceptCurator(call, author, extrinsicIndexer, wrappedEvents);
}

async function unwrapProxy(call, signer, extrinsicIndexer, events) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, extrinsicIndexer, events);
}

async function handleMultisig(call, signer, extrinsicIndexer, events) {
  const registry = await findRegistry(extrinsicIndexer);
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    registry.chainSS58
  );

  let innerCall;
  try {
    innerCall = new GenericCall(registry, callHex);
  } catch (e) {
    logger.error(`error when parse multiSig`, extrinsicIndexer);
    return;
  }

  await handleWrappedCall(innerCall, multisigAddr, extrinsicIndexer, events);
}

async function unwrapBatch(call, signer, extrinsicIndexer, wrappedEvents) {
  const method = call.method;
  const interruptedEvent = findInterrupted(wrappedEvents);

  if (UtilityMethods.batchAll === method && interruptedEvent) {
      return
  }

  let endIndex = call.args[0].length;
  if (interruptedEvent) {
    endIndex = interruptedEvent.event?.data[0].toNumber();
  }

  const innerCalls = call.args[0];
  for (let index = 0; index < endIndex; index++) {
    const innerCall = innerCalls[index];
    await handleWrappedCall(innerCall, signer, extrinsicIndexer, wrappedEvents);
  }
}

async function unwrapSudo(call, signer, extrinsicIndexer, events) {
  const innerCall = call.args[0];
  await handleWrappedCall(innerCall, signer, extrinsicIndexer, events);
}

async function handleWrappedCall(call, signer, extrinsicIndexer, wrappedEvents) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(...arguments);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(...arguments);
  } else if (Modules.Utility === section && [
    UtilityMethods.batch,
    UtilityMethods.batchAll,
  ].includes(method)) {
    await unwrapBatch(...arguments);
  } else if (Modules.Sudo === section && SudoMethods.sudo) {
    await unwrapSudo(...arguments);
  }

  await handleCall(...arguments);
}

async function extractAndHandleCall(extrinsic, wrappedEvents = [], extrinsicIndexer) {
  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(call, signer, extrinsicIndexer, wrappedEvents);
}

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    const wrappedEvents = new WrappedEvents(events, 0, false);

    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    const extrinsicIndexer = { ...blockIndexer, extrinsicIndex: index++ };
    await extractAndHandleCall(extrinsic, wrappedEvents, extrinsicIndexer);
  }
}

module.exports = {
  handleExtrinsics,
};
