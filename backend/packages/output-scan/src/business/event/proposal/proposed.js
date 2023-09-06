const { toDecimal128 } = require("../../../utils");
const { insertProposal } = require("../../../mongo/service/treasuryProposal");
const {
  consts: {
    TreasuryProposalEvents,
    TimelineItemTypes,
  },
  logger,
} = require("@osn/scan-common")
const { getTreasuryProposalMeta } = require("../../common/proposal/meta");

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
    dValue: toDecimal128(value),
    beneficiary,
    meta,
    state,
    isFinal: false,
    timeline: [timelineItem],
    motions: [],
    referendums: [],
  };

  await insertProposal(obj);
  logger.info(`Treasury proposal ${ proposalIndex } saved`);
}

module.exports = {
  saveNewTreasuryProposal,
}
