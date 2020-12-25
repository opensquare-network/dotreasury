const { TipEvents } = require("../../utils/constants");
const { saveNewTip, saveTipTimeline } = require("../../store/tip");
const { getExtrinsicSigner } = require("../../utils");

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
    const tipSinger = getExtrinsicSigner(extrinsic);
    await saveNewTip(hash, tipSinger, indexer);
  }

  if (isStateChange(method)) {
    const hash = jsonData[0];
    await saveTipTimeline(hash, method, jsonData, indexer, sort);
  }
}

module.exports = {
  handleTipEvent,
};
