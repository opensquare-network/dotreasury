const { insertTipper } = require("../../../mongo/service/tipper");
const {
  consts: {
    TipMethods,
    Modules,
    TimelineItemTypes,
  }
} = require("@osn/scan-common")
const { updateTipByHash } = require("../../../mongo/service/tip");
const { getTipCommonUpdates } = require("../../common/tip/updates");

async function handleTipCall(call, author, extrinsicIndexer) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.tip !== call.method
  ) {
    return;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();

  const updates = await getTipCommonUpdates(hash, extrinsicIndexer);
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TipMethods.tip,
    args: {
      tipper: author,
      value: tipValue,
    },
    indexer: extrinsicIndexer,
  };

  await updateTipByHash(hash, updates, timelineItem);
  await insertTipper(hash, author, tipValue, extrinsicIndexer);
}

module.exports = {
  handleTipCall,
};
