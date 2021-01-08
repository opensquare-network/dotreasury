const { getCall } = require("../utils/call");
const {
  ProxyMethods,
  Modules,
  MultisigMethods,
} = require("../utils/constants");

async function getTipMethodNameAndArgs(normalizedExtrinsic, extrinsic) {
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

  // TODO: handle other extrinsics that wrap the tip methods

  return [name, args];
}

module.exports = {
  getTipMethodNameAndArgs,
};
