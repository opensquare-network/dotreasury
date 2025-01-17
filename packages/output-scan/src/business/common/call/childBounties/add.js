const {
  consts: {
    Modules,
    ProxyMethods,
    MultisigMethods,
    UtilityMethods,
  }
} = require("@osn/scan-common");

async function extractFromProxy(call, indexer) {
  const innerCall = call.args[2];
  return extractChildBountiesAddCalls(innerCall, indexer);
}

async function extractFromProxyAnnounced(call, indexer) {
  const innerCall = call.args[3];
  return extractChildBountiesAddCalls(innerCall, indexer);
}

async function extractFromMultisig(call, indexer) {
  return extractChildBountiesAddCalls(call.args[3], indexer);
}

async function extractFromBatch(call, indexer) {
  const innerCalls = call.args[0];
  const calls = [];
  for (let index = 0; index < innerCalls.length; index++) {
    const extractedCalls = await extractChildBountiesAddCalls(innerCalls[index], indexer);
    calls.push(...extractedCalls);
  }
  return calls;
}

async function extractFromSudo(call, indexer) {
  const { method } = call;

  const isSudoAs = "sudoAs" === method;
  const targetCall = isSudoAs ? call.args[1] : call.args[0];
  return extractChildBountiesAddCalls(targetCall, indexer);
}

async function extractChildBountiesAddCalls(call, indexer) {
  const { section, method } = call;
  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return extractFromProxy(call, indexer);
  } else if (Modules.Proxy === section && "proxyAnnounced" === method) {
    return extractFromProxyAnnounced(call, indexer);
  } else if (
    [Modules.Multisig, Modules.Utility].includes(section) &&
    MultisigMethods.asMulti === method
  ) {
    return extractFromMultisig(call, indexer);
  } else if (Modules.Utility === section && [
    UtilityMethods.batch,
    UtilityMethods.batchAll,
    UtilityMethods.forceBatch,
  ].includes(method)) {
    return extractFromBatch(call, indexer);
  } else if (Modules.Sudo === section && [
    "sudo",
    "sudoAs",
  ].includes(method)) {
    return extractFromSudo(call, indexer);
  } else if ("childBounties" === section && "addChildBounty" === method) {
    return [call];
  } else {
    return [];
  }
}

module.exports = {
  extractChildBountiesAddCalls,
}
