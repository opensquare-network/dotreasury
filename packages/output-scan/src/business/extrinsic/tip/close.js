const { updateTipByHash } = require("../../../mongo/service/tip");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const { getBlockHash } = require("../../common");
const {
  env: { currentChain }, consts: {
    CHAINS,
    Modules,
    TipMethods,
    TimelineItemTypes,
    TipEvents,
  }
} = require("@osn/scan-common");

const tipCloseByExtrinsicHeight = 1906628;

async function handleCloseTipCall(call, author, extrinsicIndexer) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.closeTip !== call.method
  ) {
    return;
  }

  const chain = currentChain();
  if (chain !== CHAINS.KUSAMA) {
    return
  }

  if (extrinsicIndexer.blockHeight > tipCloseByExtrinsicHeight) {
    return
  }

  const {
    args: {
      hash,
    },
  } = call.toJSON();

  const blockHash = await getBlockHash(extrinsicIndexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: extrinsicIndexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer: extrinsicIndexer,
    state: TipEvents.TipClosed,
    data: [hash],
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TipEvents.TipClosed,
    args: {
      beneficiary: 'HEkh52pShreLjbiGuewsnbXTeXFiq5mxqF3TffeHRjsbuN5',
      payout: 50 * Math.pow(10, 12),
    },
    indexer: extrinsicIndexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  handleCloseTipCall,
}
