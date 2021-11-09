const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { getMotionCollection } = require("../../../../mongo");
const {
  BountyMethods,
  BountyStatus,
} = require("../../../common/constants");

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  const { isTreasuryBounty, treasuryBountyId } = motion;
  if (!isTreasuryBounty) {
    return;
  }

  const meta = await getBountyMeta(indexer.blockHash, treasuryBountyId);
  if (!meta) {
    return
  }

  let updates = {
    meta,
  }

  const { proposal: { method } } = motion;
  if (BountyMethods.approveBounty === method) {
    updates = {
      ...updates,
      state: {
        indexer,
        state: BountyStatus.Approved,
      }
    }
  }

  await updateBounty(treasuryBountyId, updates);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
}
