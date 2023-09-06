const { gov2ReferendumState } = require("../common/state");
const { queryAndUpdateFinalInfo } = require("../common/final/queryAndUpdateFinalInfo");
const { updateReferendaReferendum } = require("../../../../mongo/service/referendaReferendum");
const { findScheduled } = require("./scheduled");
const { busLogger } = require("@osn/scan-common");

async function handleConfirmed(event, indexer, extrinsic, blockEvents) {
  const referendumIndex = event.data[0].toNumber();
  let enactment;
  try {
    enactment = findScheduled(event, indexer, blockEvents);
  } catch (e) {
    busLogger.error(`Can not get referendum enactment info when confirmed`, e);
  }

  let updates = {};
  if (enactment) {
    updates = { ...updates, enactment };
  }
  await updateReferendaReferendum(referendumIndex, updates);
  await queryAndUpdateFinalInfo(event, indexer, gov2ReferendumState.Approved);
}

module.exports = {
  handleConfirmed,
}
