const { bigAdd, bigAdds } = require("../utils");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { handleEvents } = require("../business/event");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");
const { findRegistry } = require("../chain/specs");
const { GenericBlock } = require("@polkadot/types");

async function scanBlockFromDb(blockInDb) {
  const registry = await findRegistry(blockInDb.height);

  const block = new GenericBlock(registry, blockInDb.block.block);
  const allEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  await scanNormalizedBlock(block, allEvents);
}

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  const details = await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  const detailSlash = bigAdds([
    details.treasurySlash,
    details.idSlash,
    details.democracySlash,
    details.stakingSlash,
  ])

  const nowSeats = await getNowIncomeSeats()
  const newSeats = {
    inflation: bigAdd(nowSeats.inflation, details.inflation),
    transfer: bigAdd(nowSeats.transfer, details.transfer),
    slash: bigAdds(nowSeats.slash, detailSlash),
    slashSeats: {
      treasury: bigAdd(nowSeats.slashSeats.treasury, details.treasurySlash),
      staking: bigAdd(nowSeats.slashSeats.staking, details.stakingSlash),
      democracy: bigAdd(nowSeats.slashSeats.democracy, details.democracySlash),
      identity: bigAdd(nowSeats.slashSeats.identity, details.idSlash),
    }
  }
  
  return newSeats;
  // todo: save new seats
}

module.exports = {
  scanBlockFromDb,
  scanNormalizedBlock,
}
