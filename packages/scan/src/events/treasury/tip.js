const { TipEvents } = require("../../utils/constants");
const { saveNewTip, saveTipTimeline, updateTip } = require("../../store/tip");

function isTipEvent(method) {
  return TipEvents.hasOwnProperty(method);
}

function tipStateChange(eventName) {
  return [TipEvents.TipClosed, TipEvents.TipClosing, TipEvents.TipRetracted].includes(eventName)
}

async function handleTipEvent(method, jsonData, extrinsic, blockIndexer, sort) {
  if (!isTipEvent(method)) {
    return;
  }

  if (method === TipEvents.NewTip) {
    const [hash] = jsonData;
    await saveNewTip(hash, extrinsic, blockIndexer);
  }

  if (tipStateChange(method)) {
    const hash = jsonData[0];
    await updateTip(hash, method, jsonData, blockIndexer, extrinsic);
    // await saveTipTimeline(hash, method, jsonData, blockIndexer, sort);
  }
}

module.exports = {
  handleTipEvent,
};
