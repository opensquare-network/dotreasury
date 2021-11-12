const { bigAdd, bigAdds } = require("../utils");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { handleEvents } = require("../business/event");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  const details = await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  const detailSlash = bigAdds([
    details.treasurySlash,
    details.idSlash,
    details.democracySlash,
    details.stakingSlash,
    details.electionSlash,
  ])

  const nowSeats = await getNowIncomeSeats();
  const others = bigAdd(nowSeats.others, details.others);
  return {
    inflation: bigAdd(nowSeats.inflation, details.inflation),
    transfer: bigAdd(nowSeats.transfer, details.transfer),
    slash: bigAdd(nowSeats.slash, detailSlash),
    others,
    slashSeats: {
      treasury: bigAdd(nowSeats.slashSeats.treasury, details.treasurySlash),
      staking: bigAdd(nowSeats.slashSeats.staking, details.stakingSlash),
      democracy: bigAdd(nowSeats.slashSeats.democracy, details.democracySlash),
      election: bigAdd(nowSeats.slashSeats.election, details.electionSlash),
      identity: bigAdd(nowSeats.slashSeats.identity, details.idSlash),
    }
  }
}

module.exports = {
  scanNormalizedBlock,
}
