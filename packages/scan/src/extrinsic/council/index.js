const { translate } = require("../../utils/call");
const { handleCouncilProposeApproveProposal } = require("./proposal");
const { CouncilMethods, Modules } = require("../../utils/constants");

async function handleCouncilExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== Modules.Council) {
    return;
  }

  if (!isSuccess) {
    return;
  }

  if (name === CouncilMethods.propose) {
    await handleCouncilPropose(args, indexer, events);
  }
}

async function handleCouncilPropose(args, indexer, events) {
  // Sample data structure of args:
  // { threshold: 7,
  //   proposal:
  //    { callIndex: '0x0d06',
  //      args:
  //       { proposal_hash:
  //          '0x80829e83ab0d47757557e0b40de6c38bf7dbd41f27b91df33887f9a90ae9f32c' } } }
  const {
    threshold,
    proposal: { callIndex, args: callArgs },
  } = args;

  const callInfo = translate(callIndex);
  if (!callInfo) {
    return;
  }

  callInfo.args = callArgs;

  await handleCouncilProposeApproveProposal(
    callInfo,
    threshold,
    indexer,
    events
  );
}

module.exports = {
  handleCouncilExtrinsic,
};
