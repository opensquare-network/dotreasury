const { calcMultisigAddress } = require("../../../utils/call");
const {
  consts: {
    Modules, ProxyMethods, MultisigMethods,
  },
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function handleMultisig(call, signer, indexer) {
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();

  const blockApi = await findBlockApi(indexer.blockHash);
  return calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    blockApi.registry.chainSS58
  );
}

async function handleCall(call, signer, extrinsicIndexer) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return call.args[0].toString();
  } else if (Modules.Multisig === section && MultisigMethods.asMulti === method) {
    return handleMultisig(call, signer, extrinsicIndexer);
  }

  return signer;
}

async function findExtrinsicRealAuthor(extrinsic, indexer) {
  if (!extrinsic) {
    return null;
  }

  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  return await handleCall(call, signer, indexer);
}

module.exports = {
  findExtrinsicRealAuthor,
}
