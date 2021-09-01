const { GenericCall } = require("@polkadot/types");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");
const { getApi } = require("../api");
const { logger } = require("../utils/logger");

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

module.exports = {
  getCall,
  getMultiSigExtrinsicAddress,
  calcMultisigAddress,
};
