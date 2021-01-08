const { getMotionCollection } = require("../../mongo");
const {
  isBountyMotion,
  extractCallIndexAndArgs,
  getMotionVoting,
} = require("./utils");
const { Modules, CouncilEvents } = require("../../utils/constants");
const { motionActions } = require("./constants");

async function handleProposedForBounty(event, normalizedExtrinsic, extrinsic) {
  const [section, method, args] = await extractCallIndexAndArgs(
    normalizedExtrinsic,
    extrinsic
  );
  if (section !== Modules.Treasury || !isBountyMotion(method)) {
    return;
  }

  const eventData = event.data.toJSON();
  const [proposer, index, hash] = eventData;
  const voting = await getMotionVoting(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    hash
  );

  const timeline = [
    {
      action: motionActions.Propose,
      eventData,
      extrinsic: normalizedExtrinsic,
    },
  ];

  const { bounty_id: treasuryBountyId } = args;
  const col = await getMotionCollection();
  await col.insertOne({
    hash,
    index,
    proposer,
    method,
    treasuryBountyId,
    voting,
    state: {
      state: CouncilEvents.Proposed,
      eventData,
      extrinsic: normalizedExtrinsic,
    },
    timeline,
  });
}

module.exports = {
  handleProposedForBounty,
};
