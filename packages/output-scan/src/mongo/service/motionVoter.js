const { getUnFinalMotion } = require("./motion");
const { getMotionVoterCollection } = require("../index")
const { logger } = require("@osn/scan-common")

async function insertMotionVoter(motionHash, voter, aye, indexer) {
  const motion = await getUnFinalMotion(motionHash);
  if (!motion) {
    logger.error(`Can not find motion when insert motion voter, height: ${ indexer.blockHeight }`);
    return
  }

  const motionHeight = motion.indexer.blockHeight;
  const col = await getMotionVoterCollection();
  await col.insertOne({
    indexer,
    motionIndex: motion.index,
    motionHeight,
    motionHash,
    voter,
    aye,
  });
}

module.exports = {
  insertMotionVoter,
}
