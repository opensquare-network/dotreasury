const {
  getProposalCollection,
  getTipCollection,
  getBountyCollection,
  getBurntCollection,
  getOutTransferCollection,
} = require("../../mongo");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function calcOutputStatsAt(indexer) {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol.find({}, { value: 1, awardHeight: 1 }).toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol.find({}, { value: 1, awardHeight: 1 }).toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({}, { value: 1, awardHeight: 1 }).toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({}, { balance: 1, value: 1, indexer: 1 }).toArray();

  const outTransferCol = await getOutTransferCollection();
  const outTransfers = await outTransferCol.find({}, { awardHeight: 1, balance: 1, value: 1 }).toArray();

  return calcOutputTill(indexer, proposals, tips, bounties, burntList, outTransfers);
}

function calcOutputTill(
  indexer,
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outTransfers = [],
) {
  const spentProposals = proposals.filter(({ awardHeight }) => awardHeight && awardHeight <= indexer.blockHeight);
  const proposalSpent = spentProposals.reduce((result, { value }) => bigAdd(result, value), 0);

  const targetTips = tips.filter(tip => {
    return tip.awardHeight && tip.awardHeight <= indexer.blockHeight;
  });
  const tipSpent = targetTips.reduce((result, { value }) => bigAdd(result, value), 0);

  const targetBounties = bounties.filter(bounty => {
    return bounty.awardHeight && bounty.awardHeight <= indexer.blockHeight;
  });
  const bountySpent = targetBounties.reduce((result, { value }) => bigAdd(result, value), 0);

  const targetBurns = burntList.filter(burn => {
    return burn.indexer.blockHeight <= indexer.blockHeight;
  });
  const burntTotal = targetBurns.reduce((result, { value }) => bigAdd(result, value), 0);

  const targetTransfers = outTransfers.filter(transfer => {
    return transfer.indexer.blockHeight <= indexer.blockHeight;
  });
  const transferSpent = targetTransfers.reduce((result, { value }) => bigAdd(result, value), 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: burntTotal,
    transfer: transferSpent,
  };
}

module.exports = {
  calcOutputStatsAt,
}
