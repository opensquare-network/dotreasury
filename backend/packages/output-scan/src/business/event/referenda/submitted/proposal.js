const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { queryPreimage } = require("../query/preimage");

async function getCall(proposal, blockHash) {
  let proposalHash, call;

  if (proposal?.lookup) {
    proposalHash = proposal?.lookup?.hash;
  } else if (proposal?.legacy) {
    proposalHash = proposal?.legacy?.hash;
  }

  if (proposalHash) {
    call = await queryPreimage(proposalHash, blockHash);
  }

  if (proposal?.inline) {
    const blockApi = await findBlockApi(blockHash);
    try {
      call = blockApi.registry.createType("Proposal", proposal?.inline);
      proposalHash = call.hash.toString();
    } catch (e) {
      return {};
    }
  }

  return {
    proposalHash,
    call,
  }
}

module.exports = {
  getCall,
}
