const { GenericCall } = require("@polkadot/types");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");
const { getApi } = require("@dotreasury/common");
const { logger } = require("../logger");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
} = require("../business/common/constants");

function tryInitCall(registry, callHex) {
  try {
    return new GenericCall(registry, callHex);
  } catch (e) {
    logger.error(e.message, e.stack);
  }
}

async function getCall(blockHash, callHex) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);

  return tryInitCall(registry.registry, callHex) || {};
}

async function getMultiSigExtrinsicAddress(args = {}, signer) {
  const { threshold, other_signatories: otherSignatories } = args;
  const api = await getApi();

  return calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    api.registry.chainSS58
  );
}

function calcMultisigAddress(signatories, threshold, chainSS58) {
  const multiPub = createKeyMulti(signatories, threshold);
  return encodeAddress(multiPub, chainSS58);
}

function getRealCaller(call, caller) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return call.args[0].toJSON();
  }

  if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
    // TODO:  Maybe other methods, check them out
  ) {
    const callHex = call.args[3];
    const innerCall = new GenericCall(call.registry, callHex);
    if (
      Modules.Proxy === innerCall.section &&
      ProxyMethods.proxy === innerCall.method
    ) {
      return innerCall.args[0].toJSON();
    }

    const threshold = call.args[0].toNumber();
    const otherSignatories = call.args[1].toJSON();
    return calcMultisigAddress(
      [caller, ...otherSignatories],
      threshold,
      call.registry.chainSS58
    );
  }

  return caller;
}

module.exports = {
  getCall,
  getMultiSigExtrinsicAddress,
  calcMultisigAddress,
  getRealCaller,
};
