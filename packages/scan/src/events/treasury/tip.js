const { TipEvents, Modules } = require("../../utils/constants");
const {
  saveNewTip,
  updateTipFinalState,
  updateTipByClosingEvent,
} = require("../../store/tip");

async function handleTipEvent(
  event,
  normalizedExtrinsic,
  blockIndexer,
  extrinsic
) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || !TipEvents.hasOwnProperty(method)) {
    return false;
  }

  const eventData = data.toJSON();
  const [hash] = eventData;
  if (method === TipEvents.NewTip) {
    await saveNewTip(hash, normalizedExtrinsic, extrinsic);
  } else if (method === TipEvents.TipClosing) {
    // TODO: remove this logic when we can analyse all the tip extrinsic
    await updateTipByClosingEvent(
      hash,
      TipEvents.TipClosing,
      eventData,
      normalizedExtrinsic
    );
  } else if ([TipEvents.TipClosed, TipEvents.TipRetracted].includes(method)) {
    await updateTipFinalState(
      hash,
      method,
      eventData,
      normalizedExtrinsic,
      extrinsic
    );
  }

  return true;
}

module.exports = {
  handleTipEvent,
};
