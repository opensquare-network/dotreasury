const { getProposalOutputStatsAt } = require("./proposal");
const { getTipOutputStatsAt } = require("./tip");
const { getBountyOutputStatsAt } = require("./bounty");
const { getBurnOutputStatsAt } = require("./burn");
const { getTransferOutputStatsAt } = require("./transfer");

async function getOutputStatsAt(indexer) {
  const proposal = await getProposalOutputStatsAt(indexer);
  const tip = await getTipOutputStatsAt(indexer);
  const bounty = await getBountyOutputStatsAt(indexer);
  const burnt = await getBurnOutputStatsAt(indexer);
  const transfer = await getTransferOutputStatsAt(indexer);

  return {
    proposal,
    tip,
    bounty,
    burnt,
    transfer,
  }
}

module.exports = {
  getOutputStatsAt,
}
