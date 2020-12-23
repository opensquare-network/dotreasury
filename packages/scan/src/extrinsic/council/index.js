const { translate } = require("./call");
const { handleCouncilProposeApproveProposal } = require("./proposal");

async function handleCouncilExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== "council") {
    return;
  }

  if (!isSuccess) {
    return;
  }

  if (name === "propose") {
    await handleCouncilPropose(args, indexer, events);
  } else if (name === "vote") {
    await handleCouncilVote(args, indexer, events);
  } else if (name === "close") {
    await handleCouncilClose(args, indexer, events);
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

  await handleCouncilProposeApproveProposal(
    callInfo,
    callArgs,
    threshold,
    indexer,
    events
  );
}

async function handleCouncilVote(args, indexer, events) {}

async function handleCouncilClose(args, indexer, events) {}

module.exports = {
  handleCouncilExtrinsic,
};
