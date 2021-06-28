const {
  TipEvents,
  Modules,
  ksmTreasuryRefactorApplyHeight,
  dotTreasuryRefactorApplyHeight,
} = require("../../utils/constants");
const {
  saveNewTip,
  updateTipFinalState,
  updateTipByClosingEvent,
} = require("../../store/tip");
const { currentChain, CHAINS } = require("../../chain");

function _isKsmTipEvent(section, method, height) {
  const isSection =
    section ===
    (height < ksmTreasuryRefactorApplyHeight ? Modules.Treasury : Modules.Tips);
  return isSection && TipEvents.hasOwnProperty(method);
}

function _isDotTipEvent(section, method, height) {
  const isSection =
    section ===
    (height < dotTreasuryRefactorApplyHeight ? Modules.Treasury : Modules.Tips);
  return isSection && TipEvents.hasOwnProperty(method);
}

function isTipEvent(section, method, height) {
  const chain = currentChain();
  if (chain === CHAINS.POLKADOT) {
    return _isDotTipEvent(section, method, height);
  } else if (chain === CHAINS.KUSAMA) {
    return _isKsmTipEvent(section, method, height);
  }
}

async function handleTipEvent(
  event,
  normalizedExtrinsic,
  blockIndexer,
  extrinsic
) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method, blockIndexer.blockHeight)) {
    return;
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
}

module.exports = {
  handleTipEvent,
};
