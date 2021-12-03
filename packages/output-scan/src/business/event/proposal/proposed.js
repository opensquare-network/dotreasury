const { insertProposal } = require("../../../mongo/service/treasuryProposal");
const { TreasuryProposalEvents } = require("../../common/constants");
const { TimelineItemTypes } = require("../../common/constants");
const { getTreasuryProposalMeta } = require("../../common/proposal/meta");
const { logger } = require("@dotreasury/common");

async function saveNewTreasuryProposal(event, extrinsic, eventIndexer) {
  const [proposalIndex] = event.data.toJSON();

  const meta = await getTreasuryProposalMeta(eventIndexer.blockHash, proposalIndex);
  const { proposer, value, beneficiary } = meta;

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TreasuryProposalEvents.Proposed,
    args: {
      index: proposalIndex,
    },
    indexer: eventIndexer,
  };

  const state = {
    indexer: eventIndexer,
    state: TreasuryProposalEvents.Proposed,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer: eventIndexer,
    proposalIndex,
    proposer,
    value,
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
    motions: [],
  };

  await insertProposal(obj);
  logger.info(`Treasury proposal ${ proposalIndex } saved`);
}

module.exports = {
  saveNewTreasuryProposal,
}
