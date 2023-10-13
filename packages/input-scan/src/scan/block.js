const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { handleEvents } = require("../business/event");
const {
  env: { currentChain },
  chain: {
    getBlockIndexer,
  },
  utils: { bigAdds, bigAdd }
} = require("@osn/scan-common");

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  const details = await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  const detailSlash = bigAdds([
    details.treasurySlash,
    details.idSlash,
    details.democracySlash,
    details.stakingSlash,
    details.electionSlash,
    details.referendaSlash,
    details.fellowshipReferendaSlash,
  ])

  const nowSeats = await getNowIncomeSeats();
  const others = bigAdd(nowSeats.others, details.others);
  const result = {
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
      referenda: bigAdd(nowSeats.slashSeats.referenda || 0, details.referendaSlash),
      fellowshipReferenda: bigAdd(nowSeats.slashSeats.fellowshipReferenda || 0, details.fellowshipReferendaSlash),
    }
  }

  if ("centrifuge" === currentChain()) {
    Object.assign(result, {
      centrifugeBlockReward: bigAdd(nowSeats.centrifugeBlockReward || 0, details.centrifugeBlockReward || 0)
    });
  }

  return result;
}

module.exports = {
  scanNormalizedBlock,
}
