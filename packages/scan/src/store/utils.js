const { getCall } = require("../utils/call");
const {
  ProxyMethods,
  Modules,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../utils/constants");
const { hexToString } = require("@polkadot/util");

async function getTipMethodNameAndArgs(
  normalizedExtrinsic,
  extrinsic,
  reasonText
) {
  const {
    section,
    name,
    args,
    extrinsicIndexer: indexer,
  } = normalizedExtrinsic;

  if (name === ProxyMethods.proxy) {
    const call = await getCall(indexer.blockHash, extrinsic.args[2].toHex());
    return [call.method, call.toJSON().args];
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === name) {
    const call = await getCall(
      indexer.blockHash,
      extrinsic.method.args[3].toHex()
    );
    return [call.method, call.toJSON().args];
  }

  if (Modules.Utility === section && UtilityMethods.batch === name) {
    const blockHash = normalizedExtrinsic.extrinsicIndexer.blockHash;
    const batchCalls = extrinsic.method.args[0];

    for (const callInBatch of batchCalls) {
      const rawCall = callInBatch.toHex();
      const call = await getCall(blockHash, rawCall);

      if (
        Modules.Treasury === call.section &&
        [TipMethods.tipNew, TipMethods.reportAwesome].includes(call.method)
      ) {
        const {
          args: { reason },
        } = call.toJSON();
        if (reasonText === hexToString(reason)) {
          return [call.method, call.toJSON().args];
        }
      }
    }
  }

  // TODO: handle other extrinsics that wrap the tip methods

  return [name, args];
}

module.exports = {
  getTipMethodNameAndArgs,
};
