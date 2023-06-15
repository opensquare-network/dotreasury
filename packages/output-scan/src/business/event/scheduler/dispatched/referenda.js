const { toDecimal128 } = require("../../../../utils");
const { insertProposal } = require("../../../../mongo/service/treasuryProposal");
const { getTreasuryProposalMeta } = require("../../../common/proposal/meta");
const { gov2ReferendumState } = require("../../referenda/common/state");
const { getReferendaReferendumCol, getReferendaReferendumTimelineCol } = require("../../../../mongo");
const {
  consts: { TimelineItemTypes },
  logger,
} = require("@osn/scan-common");

function findSpendEvents(blockEvents, startIndex, indexer) {
  let events = [];
  for (let i = startIndex; i >= 0; i--) {
    const iterEvent = blockEvents[i].event;
    const { section, method } = iterEvent;
    if ("scheduler" === section && "Dispatched" === method) {
      break;
    } else if ("treasury" !== section || "SpendApproved" !== method) {
      continue;
    }

    events.push({
      event: iterEvent,
      indexer: {
        ...indexer,
        eventIndex: i,
      }
    })
  }

  return events;
}

async function saveOneProposal({ event, indexer }, referendum) {
  const { referendumIndex, proposer, trackInfo } = referendum;
  const proposalIndexer = indexer;

  const proposalIndex = event.data[0].toNumber();
  const value = event.data[1].toString();
  const beneficiary = event.data[2].toString();
  const meta = await getTreasuryProposalMeta(indexer.blockHash, proposalIndex);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: "SpendApproved",
    args: {},
    indexer: proposalIndexer,
  };

  const state = {
    indexer: proposalIndexer,
    state: "Approved",
    data: [proposalIndex, value, beneficiary],
  };

  const obj = {
    indexer: proposalIndexer,
    proposalIndex,
    proposer: proposer,
    value,
    dValue: toDecimal128(value),
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
    isByGov2: true,
    isFinal: false,
    gov2Referendum: referendumIndex,
    track: {
      id: trackInfo.id,
      name: trackInfo.name,
    }
  };

  await insertProposal(obj);
  const referendumCol = await getReferendaReferendumCol();
  await referendumCol.updateOne(
    { referendumIndex },
    { $set: { treasuryProposalIndex: proposalIndex } },
  );
  logger.info(`Treasury proposal ${ proposalIndex } saved by gov2 referendum ${ referendumIndex }`);
}

async function handleSpendAndApproved(referendum, indexer, blockEvents) {
  if (!blockEvents[indexer.eventIndex - 1]) {
    return null;
  }

  const spendEvents = findSpendEvents(blockEvents, indexer.eventIndex - 1, indexer);
  for (const spendEvent of spendEvents) {
    await saveOneProposal(spendEvent, referendum);
  }
}

async function handleReferenda(event, indexer, extrinsic, blockEvents) {
  const taskAddress = event.data[0];
  const when = taskAddress[0].toNumber();
  const index = taskAddress[1].toNumber();
  const result = event.data[2].toJSON();

  const referendumCol = await getReferendaReferendumCol();
  const referendum = await referendumCol.findOne({ "enactment.when": when, "enactment.index": index });
  if (!referendum) {
    return
  }

  const state = {
    name: gov2ReferendumState.Executed,
    indexer,
    args: {
      result,
    }
  }

  const { referendumIndex } = referendum;
  await referendumCol.updateOne(
    { referendumIndex },
    { $set: { state, isFinal: true } },
  );

  const timelineCol = await getReferendaReferendumTimelineCol();
  await timelineCol.insertOne({
    referendumIndex,
    indexer,
    name: gov2ReferendumState.Executed,
    args: {
      result,
    },
  });

  await handleSpendAndApproved(referendum, indexer, blockEvents);
}

module.exports = {
  handleReferenda,
}
