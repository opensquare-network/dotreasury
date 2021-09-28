const { Modules, TipEvents } = require("../../common/constants");
const { saveNewTip } = require("./store");
const {
  updateTipWithClosing,
  updateTipWithTipClosed,
  updateTipWithTipSlashed,
  updateTipWithTipRetracted,
} = require("./store");

function isTipEvent(section, method) {
  if (![Modules.Treasury, Modules.Tips].includes(section)) {
    return false;
  }

  return TipEvents.hasOwnProperty(method);
}

async function handleTipEvent(event, extrinsic, indexer) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method)) {
    return;
  }

  if (TipEvents.NewTip === method) {
    await saveNewTip(event, extrinsic, indexer);
  } else if (TipEvents.TipClosing === method) {
    const [hash] = data;
    await updateTipWithClosing(hash.toString(), indexer);
  } else if (TipEvents.TipClosed === method) {
    await updateTipWithTipClosed(event, extrinsic, indexer);
  } else if (TipEvents.TipRetracted === method) {
    await updateTipWithTipRetracted(event, extrinsic, indexer);
  } else if (TipEvents.TipSlashed === method) {
    await updateTipWithTipSlashed(event, extrinsic, indexer);
  }
}

module.exports = {
  handleTipEvent,
};
