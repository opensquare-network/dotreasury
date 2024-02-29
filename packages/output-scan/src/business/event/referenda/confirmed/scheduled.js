const isNil = require("lodash.isnil");
const { getReferendaReferendumCol } = require("../../../../mongo");
const { queryTrackInfo } = require("../query/trackInfo");

function calcEnactmentHeight(trackInfo, enactment, confirmedAt) {
  const { after, at } = enactment;
  let desired = 0;
  if (!isNil(after)) {
    desired = confirmedAt + after;
  } else if (!isNil(at)) {
    desired = at;
  }

  const minHeight = confirmedAt + trackInfo.minEnactmentPeriod;
  return Math.max(desired, minHeight);
}

function getEnactmentByEstimation(estimatedEnactmentHeight, indexer, blockEvents) {
  let eventIndex = indexer.eventIndex - 1;
  while (eventIndex >= 0) {
    let event = blockEvents[eventIndex].event;
    if ("scheduler" !== event.section || "Scheduled" !== event.method) {
      eventIndex--;
      continue
    }

    const when = event.data[0].toNumber();
    const index = event.data[1].toNumber();
    if (when === estimatedEnactmentHeight) {
      return { when, index };
    }

    eventIndex--;
  }
}

async function getTrackInfo(indexer, referendumIndex) {
  const referendumCol = await getReferendaReferendumCol();
  const referendum = await referendumCol.findOne({ referendumIndex });
  if (!referendum) {
    return null;
  }

  return await queryTrackInfo(referendum.trackId, indexer.blockHash);
}

async function findScheduled(event, indexer, blockEvents) {
  const referendumIndex = event.data[0].toNumber();
  const referendumCol = await getReferendaReferendumCol();
  const referendum = await referendumCol.findOne({ referendumIndex });
  if (referendum) {
    const trackInfo = await getTrackInfo(indexer, referendumIndex);
    const { info: { enactment } } = referendum;

    const estimatedHeight = calcEnactmentHeight(trackInfo, enactment, indexer.blockHeight);
    const scheduled = getEnactmentByEstimation(estimatedHeight, indexer, blockEvents);
    if (scheduled) {
      return scheduled;
    }
  }

  if (indexer.eventIndex <= 0) {
    throw new Error(`Can not find scheduled info at ${ indexer.blockHeight } for referendum ${ referendumIndex }`);
  }

  let maybeScheduledEvent = blockEvents[indexer.eventIndex - 1].event;
  if (
    "preimage" === maybeScheduledEvent.section &&
    "Requested" === maybeScheduledEvent.method &&
    indexer.eventIndex >= 2
  ) {
    maybeScheduledEvent = blockEvents[indexer.eventIndex - 2].event
  }

  const { section, method } = maybeScheduledEvent;
  if ("scheduler" !== section || "Scheduled" !== method) {
    throw new Error(`Can not find scheduled info at ${ indexer.blockHeight } for referendum ${ referendumIndex }`);
  }

  return {
    when: maybeScheduledEvent.data[0].toNumber(),
    index: maybeScheduledEvent.data[1].toNumber(),
  }
}

module.exports = {
  findScheduled,
}
