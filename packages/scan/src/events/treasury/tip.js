const { TipEvents } = require("../../utils/constants");
const { saveNewTip, saveTipTimeline, updateTip } = require("../../store/tip");

function isTipEvent(method) {
  return TipEvents.hasOwnProperty(method);
}

const isStateChange = isTipEvent;

async function handleTipEvent(method, jsonData, extrinsic, indexer, sort) {
  if (!isTipEvent(method)) {
    return;
  }

  if (method === TipEvents.NewTip) {
    const [hash] = jsonData;
    await saveNewTip(hash, extrinsic, indexer);
  }

  if (isStateChange(method)) {
    const hash = jsonData[0];
    await saveTipTimeline(hash, method, jsonData, indexer, sort);
    await updateTip(hash, method, jsonData, indexer);
  }
}

module.exports = {
  handleTipEvent,
};
