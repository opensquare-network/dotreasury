const { updatePeriod } = require("../../../mongo/service");
const { getPeriodByEndHeight } = require("../../../mongo/service");
const { hasPeriodMark, clearPeriodMark } = require("../../../store");
const { findProposalsInPeriod } = require("./proposal");
const { findBountiesInPeriod } = require("./bounty");
const { findTipsInPeriod } = require("./tip");
const { findOutTransfersInPeriod } = require("./transfer");
const { findBurntInPeriod } = require("./burnt");

async function handlePeriod(indexer) {
  const blockHeight = indexer.blockHeight;
  if (!hasPeriodMark(blockHeight)) {
    return
  }

  const period = await getPeriodByEndHeight(blockHeight);
  if (!period) {
    throw new Error(`Can not get period at ${ blockHeight }`);
  }

  const {
    startIndexer: { blockHeight: startHeight },
    endIndexer: { blockHeight: endHeight },
  } = period;

  const proposals = await findProposalsInPeriod(startHeight, endHeight);
  const bounties = await findBountiesInPeriod(startHeight, endHeight);
  const tips = await findTipsInPeriod(startHeight, endHeight);
  const transfers = await findOutTransfersInPeriod(startHeight, endHeight);
  const burnt = await findBurntInPeriod(startHeight, endHeight);

  await updatePeriod(indexer.blockHeight, {
    proposals,
    bounties,
    tips,
    transfers,
    burnt,
  });

  clearPeriodMark(blockHeight);
}

module.exports = {
  handlePeriod,
}
