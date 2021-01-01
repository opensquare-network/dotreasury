const { TipEvents, Modules } = require("../../utils/constants");
const {
  saveNewTip,
  updateTipFinalState,
  updateTipByClosingEvent,
} = require("../../store/tip");

async function handleTipEvent(event, extrinsic, blockIndexer) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || !TipEvents.hasOwnProperty(method)) {
    return;
  }

  const eventData = data.toJSON();
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
    await updateTipFinalState(hash, method, eventData, extrinsic);
  }
}

module.exports = {
  handleTipEvent,
};
