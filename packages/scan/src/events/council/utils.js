const { findBlockApi } = require("../../chain/spec");
const {
  ProposalMethods,
  BountyMethods,
  Modules,
  ProxyMethods,
  MultisigMethods,
} = require("../../utils/constants");
const { getApi } = require("../../api");
const { GenericCall } = require("@polkadot/types");

function isProposalMotion(method) {
  return [
    ProposalMethods.approveProposal,
    ProposalMethods.rejectProposal,
  ].includes(method);
}

function isBountyMethod(method) {
  return [
    BountyMethods.approveBounty,
    BountyMethods.proposeCurator,
    BountyMethods.unassignCurator,
    BountyMethods.closeBounty,
  ].includes(method);
}

function getBountyVotingName(method) {
  switch (method) {
    case BountyMethods.approveBounty:
      return "ApproveVoting";
    case BountyMethods.proposeCurator:
      return "ProposeCuratorVoting";
    case BountyMethods.unassignCurator:
      return "UnassignCuratorVoting";
    case BountyMethods.closeBounty:
      return "CloseVoting";
  }
}

async function extractCallIndexAndArgs(normalizedExtrinsic, extrinsic) {
  const { section, name } = normalizedExtrinsic;

  if (Modules.Proxy === section && ProxyMethods.proxy === name) {
    const proposeCall = new GenericCall(
      extrinsic.registry,
      extrinsic.args[2].toHex()
    );
    const call = new GenericCall(
      extrinsic.registry,
      proposeCall.args[1].toHex()
    );
    return [call.section, call.method, call.toJSON().args];
  }

  if ([Modules.Multisig, Modules.Utility].includes(section) && MultisigMethods.asMulti === name) {
    const proposeCall = new GenericCall(
      extrinsic.registry,
      extrinsic.method.args[3].toHex()
    );
    const call = new GenericCall(
      extrinsic.registry,
      proposeCall.args[1].toHex()
    );
    return [call.section, call.method, call.toJSON().args];
  }

  const {
    args: {
      proposal: { args: proposalArgs },
    },
  } = normalizedExtrinsic;
  const call = new GenericCall(extrinsic.registry, extrinsic.args[1].toHex());
  return [call.section, call.method, proposalArgs];
}

async function getMotionVoting(blockHash, motionHash) {
  const api = await findBlockApi(blockHash)
  const votingObject = await api.query.council.voting(motionHash);
  return votingObject.toJSON();
}

async function getMotionVotingByHeight(height, motionHash) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return await getMotionVoting(blockHash, motionHash);
}

module.exports = {
  isProposalMotion,
  isBountyMethod,
  getBountyVotingName,
  extractCallIndexAndArgs,
  getMotionVoting,
  getMotionVotingByHeight,
};
