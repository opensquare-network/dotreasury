const { GenericCall } = require("@polkadot/types");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");
const { getApi } = require("../api");
const { logger } = require("../utils/logger");

const treasuryProposalCouncilIndexes = ["0x1201", "0x1202"];
const approveProposalIndex = "0x1202";
const rejectProposalIndex = "0x1201";

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
  const multiAddresses = [signer, ...otherSignatories];
  const multiPub = createKeyMulti(multiAddresses, threshold);
  const api = await getApi();
  return encodeAddress(multiPub, api.registry.chainSS58);
}

module.exports = {
  treasuryProposalCouncilIndexes,
  approveProposalIndex,
  rejectProposalIndex,
  getCall,
  getMultiSigExtrinsicAddress,
};
