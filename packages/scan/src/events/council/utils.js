const { ProposalMethods, BountyMethods } = require("../../utils/constants");
const { getCall } = require("../../utils/call");
const { getApi } = require("../../api");

function isProposalMotion(method) {
  return [
    ProposalMethods.approveProposal,
    ProposalMethods.rejectProposal,
  ].includes(method);
}

function isBountyMotion(method) {
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
  // TODO: handle proxy extrinsic
  const blockHash = normalizedExtrinsic.extrinsicIndexer.blockHash;
  const { section, name, args } = normalizedExtrinsic;
  if ("utility" === section && "asMulti" === name) {
    const {
      call: {
        args: {
          proposal: { args: proposalArgs },
        },
      },
    } = args;
    const call = await getCall(blockHash, extrinsic.method.args[3].toHex());
    return [call.section, call.method, proposalArgs];
  }

  const {
    args: {
      proposal: { args: proposalArgs },
    },
  } = normalizedExtrinsic;
  const call = await getCall(blockHash, extrinsic.args[1].toHex());
  return [call.section, call.method, proposalArgs];
}

async function getMotionVoting(blockHash, motionHash) {
  const api = await getApi();
  const votingObject = await api.query.council.voting.at(blockHash, motionHash);
  return votingObject.toJSON();
}

async function getMotionVotingByHeight(height, motionHash) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return await getMotionVoting(blockHash, motionHash);
}

module.exports = {
  isProposalMotion,
  isBountyMotion,
  getBountyVotingName,
  extractCallIndexAndArgs,
  getMotionVoting,
  getMotionVotingByHeight,
};
