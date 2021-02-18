const {
  TipEvents,
  Modules,
  ksmTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const {
  saveNewTip,
  updateTipFinalState,
  updateTipByClosingEvent,
} = require("../../store/tip");

function isTipEvent(section, method, height) {
  if (
    height < ksmTreasuryRefactorApplyHeight &&
    Modules.Treasury === section &&
    TipEvents.hasOwnProperty(method)
  ) {
    return true;
  }

  return (
    height >= ksmTreasuryRefactorApplyHeight &&
    Modules.Tips === section &&
    TipEvents.hasOwnProperty(method)
  );
}

async function handleTipEvent(
  event,
  normalizedExtrinsic,
  blockIndexer,
  extrinsic
) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method, blockIndexer.blockHeight)) {
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
  } else if (
    [
      TipEvents.TipClosed,
      TipEvents.TipRetracted,
      TipEvents.TipSlashed,
    ].includes(method)
  ) {
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
