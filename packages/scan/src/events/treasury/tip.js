const { TipEvents } = require("../../utils/constants");
const {
  saveNewTip,
  updateTipByFinalEvent,
  updateTipByClosingEvent,
} = require("../../store/tip");

async function handleTipEvent(method, eventData, extrinsic, blockIndexer) {
  if (!TipEvents.hasOwnProperty(method)) {
    return;
  }

  const [hash] = eventData;
  if (method === TipEvents.NewTip) {
    await saveNewTip(hash, extrinsic, blockIndexer);
  } else if (method === TipEvents.TipClosing) {
    // TODO: remove this logic when we can analyse all the tip extrinsic
    await updateTipByClosingEvent(
      hash,
      TipEvents.TipClosing,
      eventData,
      extrinsic
    );
  } else if ([TipEvents.TipClosed, TipEvents.TipRetracted].includes(method)) {
    await updateTipByFinalEvent(hash, method, eventData, extrinsic);
  }
}

module.exports = {
  handleTipEvent,
};
