const { TipEvents } = require("../../utils/constants");
const { saveNewTip, updateTip } = require("../../store/tip");
const { logger } = require("../../utils");

function isTipEvent(method) {
  return TipEvents.hasOwnProperty(method);
}

function tipStateChange(eventName) {
  return [TipEvents.TipClosed, TipEvents.TipRetracted].includes(eventName);
}

async function handleTipEvent(method, eventData, extrinsic, blockIndexer) {
  if (!isTipEvent(method)) {
    return;
  }

  if (method === TipEvents.NewTip) {
    const [hash] = eventData;
    await saveNewTip(hash, extrinsic, blockIndexer);
  }

  if (tipStateChange(method)) {
    const hash = eventData[0];
    logger.info(`update tip with event ${method}`);
    await updateTip(hash, method, eventData, blockIndexer, extrinsic);
    // await saveTipTimeline(hash, method, jsonData, blockIndexer, sort);
  }
}

module.exports = {
  handleTipEvent,
};
