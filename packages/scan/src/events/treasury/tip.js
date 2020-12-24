const { TipEvents } = require("../../utils/constants");
const { saveNewTip, saveTipTimeline } = require("../../store/tip");

function isTipEvent(method) {
  return TipEvents.hasOwnProperty(method);
}

isStateChange = isTipEvent;

async function handleTipEvent(method, jsonData, indexer, sort) {
  if (!isTipEvent(method)) {
    return;
  }

  if (method === TipEvents.NewTip) {
    const [hash] = jsonData;
    await saveNewTip(hash, indexer);
  }

  if (isStateChange(method)) {
    const hash = jsonData[0];
    const state = method;
    await saveTipTimeline(hash, state, jsonData, indexer, sort);
  }
}

module.exports = {
  handleTipEvent,
};
