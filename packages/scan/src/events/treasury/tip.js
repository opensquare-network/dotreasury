const { TipEvents } = require("../../utils/constants");
const { saveNewTip, updateTip } = require("../../store/tip");
const { logger } = require("../../utils");

function isTipEvent(method) {
  return TipEvents.hasOwnProperty(method);
}

function tipStateChange(eventName) {
  return [TipEvents.TipClosed, TipEvents.TipRetracted].includes(eventName);
}

async function handleTipEvent(event, extrinsic, blockIndexer) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || !isTipEvent(method)) {
    return;
  }

  const eventData = data.toJSON();
  const hash = eventData[0];
  if (method === TipEvents.NewTip) {
    await saveNewTip(hash, extrinsic, blockIndexer);
  }

  if (tipStateChange(method)) {
    logger.info(`update tip with event ${method}`);
    await updateTip(hash, method, eventData, blockIndexer, extrinsic);
  }
}

module.exports = {
  handleTipEvent,
};
