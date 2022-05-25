const { GenericCall } = require("@polkadot/types");
const {
  consts: {
    Modules,
    ProxyMethods,
    MultisigMethods,
    UtilityMethods,
  }
} = require("@osn/scan-common");

function findTargetCallFromProxy(proxyCall, targetSection, targetMethod) {
  const innerCall = proxyCall.args[2];
  return findTargetCall(innerCall, targetSection, targetMethod);
}

function findTargetCallFromMultisig(multisigCall, targetSection, targetMethod) {
  const callHex = multisigCall.args[3];
  const innerCall = new GenericCall(multisigCall.registry, callHex);
  return findTargetCall(innerCall, targetSection, targetMethod);
}

function findTargetCallFromBatch(batchCall, targetSection, targetMethod) {
  for (const innerCall of batchCall.args[0]) {
    const call = findTargetCall(innerCall, targetSection, targetMethod);
    if (call.section === targetSection && call.method === targetMethod) {
      //FIXME: here we only get the first call which has the target section and target method, but there maybe multiple
      // these kinds of calls in batch extrinsic. Need more info to figure out the target call.
      return call;
    }
  }

  return batchCall;
}

function findTargetCall(call, targetSection, targetMethod) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return findTargetCallFromProxy(...arguments);
  }

  if (Modules.Multisig === section && MultisigMethods.asMulti === method) {
    return findTargetCallFromMultisig(...arguments);
  }

  if (Modules.Utility === section && [
    UtilityMethods.batch,
    UtilityMethods.batchAll,
  ].includes(method)) {
    return findTargetCallFromBatch(...arguments);
  }

  if (call.section === targetSection && call.method === targetMethod) {
    return call;
  }

  return null;
}

function findCallInSections(call, sections, targetMethod) {
  for (const section of sections) {
    let result = findTargetCall(call, section, targetMethod);
    if (result) {
      return result;
    }
  }

  return null;
}

module.exports = {
  findTargetCall,
  findCallInSections,
}
