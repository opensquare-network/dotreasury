const {
  Modules,
  MultisigMethods,
  ProxyMethods,
  UtilityMethods,
  SudoMethods,
} = require("../constants");
const { calcMultisigAddress } = require("../../../utils/call");
const { findRegistry } = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");
const { logger } = require("../../../logger")

async function unwrapProxy(call, signer, indexer, events, cb) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, indexer, events, cb);
}

async function handleMultisig(call, signer, indexer, events, cb) {
  const registry = await findRegistry(indexer);
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
    logger.error(`error when parse multiSig`, indexer);
    return;
  }

  await handleWrappedCall(innerCall, multisigAddr, indexer, events, cb);
}

async function unwrapBatch(call, signer, indexer, events, cb) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(innerCall, signer, indexer, events, cb);
  }
}

async function unwrapSudo(call, signer, indexer, events, cb) {
  const innerCall = call.args[0];
  await handleWrappedCall(innerCall, signer, indexer, events, cb);
}

async function handleWrappedCall(call, signer, indexer, events, callback) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(...arguments);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(...arguments);
  } else if (Modules.Utility === section && UtilityMethods.batch === method) {
    await unwrapBatch(...arguments);
  } else if (Modules.Sudo === section && SudoMethods.sudo) {
    await unwrapSudo(...arguments);
  }

  await callback(call, signer, indexer, events);
}

module.exports = {
  handleWrappedCall,
}
