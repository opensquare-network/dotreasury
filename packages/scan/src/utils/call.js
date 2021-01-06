const { GenericCall } = require("@polkadot/types");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");
const { getApi } = require("../api");

const treasuryProposalCouncilIndexes = ["0x1201", "0x1202"];
const approveProposalIndex = "0x1202";
const rejectProposalIndex = "0x1201";

async function getCall(blockHash, callHex) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return new GenericCall(registry.registry, callHex);
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
