const { getBountyMeta } = require("../treasury/bounty/utils");
const { getMotionCollection, getBountyCollection } = require("../../mongo");
const {
  isBountyMethod,
  extractCallIndexAndArgs,
  getMotionVoting,
} = require("./utils");
const {
  Modules,
  CouncilEvents,
  ksmTreasuryRefactorApplyHeight,
  dotTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const { motionActions } = require("./constants");
const { currentChain, CHAINS } = require("../../chain");
const { getApi } = require("../../api/index");

function _isKsmBountyMotion(section, method, height) {
  if (
    height < ksmTreasuryRefactorApplyHeight &&
    section === Modules.Treasury &&
    isBountyMethod(method)
  ) {
    return true;
  }

  return (
    height >= ksmTreasuryRefactorApplyHeight &&
    section === Modules.Bounties &&
    isBountyMethod(method)
  );
}

function _isDotBountyMotion(section, method, height) {
  if (
    height < dotTreasuryRefactorApplyHeight &&
    section === Modules.Treasury &&
    isBountyMethod(method)
  ) {
    return true;
  }

  return (
    height >= dotTreasuryRefactorApplyHeight &&
    section === Modules.Bounties &&
    isBountyMethod(method)
  );
}

function isBountyMotion(section, method, height) {
  const chain = currentChain();
  if (CHAINS.KUSAMA === chain) {
    return _isKsmBountyMotion(section, method, height);
  } else {
    return _isDotBountyMotion(section, method, height);
  }
}

async function handleProposedForBounty(event, normalizedExtrinsic, extrinsic) {
  const [section, method, args] = await extractCallIndexAndArgs(
    normalizedExtrinsic,
    extrinsic
  );
  if (
    !isBountyMotion(
      section,
      method,
      normalizedExtrinsic.extrinsicIndexer.blockHeight
    )
  ) {
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
    isFinal: false,
    state: {
      state: CouncilEvents.Proposed,
      eventData,
      extrinsic: normalizedExtrinsic,
    },
    timeline,
  });
}

async function updateBountyByVoteResult(hash, isApproved, indexer) {
  const motionCol = await getMotionCollection();
  const motion = await motionCol.findOne({ hash, isFinal: false });

  if (!motion || !isBountyMethod(motion.method)) {
    // it means this motion hash is not a treasury bounty motion hash
    return;
  }

  const meta = await getBountyMeta(
    indexer.blockHash,
    motion.treasuryBountyId
  );

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex: motion.treasuryBountyId },
    { $set: { meta } }
  );
}

module.exports = {
  handleProposedForBounty,
  updateBountyByVoteResult,
};
