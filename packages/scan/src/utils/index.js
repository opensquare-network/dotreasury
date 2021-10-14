const { logger, incomeKnownHeightsLogger } = require("./logger");
const BigNumber = require("bignumber.js");
const { calcMultisigAddress } = require("./call");
const { getApi } = require("../api");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
} = require("./constants");
const { GenericCall } = require("@polkadot/types");
const { getTreasuryBalance: getTreasuryFreeBalance } = require("./freeBalance");

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex;
  });
}

function isExtrinsicSuccess(events) {
  return events.some((e) => e.event.method === "ExtrinsicSuccess");
}

function getExtrinsicSigner(extrinsic) {
  let signer = extrinsic._raw.signature.get("signer").toString();
  return signer;
}

function median(values) {
  if (!Array.isArray(values)) {
    return null;
  }

  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

function gt(v1, v2) {
  return new BigNumber(v1).isGreaterThan(v2);
}

function getConstFromRegistry(registry, moduleName, constantName) {
  const pallets = registry.metadata.pallets;
  const pallet = pallets.find(p => p.name.toString() === moduleName);
  if (!pallet) {
    return null;
  }

  const constant = pallet.constants.find(c => c.name.toString() === constantName);
  if (!constant) {
    return null
  }

  const def = registry.lookup.types[constant.type.toNumber()].type.def;
  if (def.isHistoricMetaCompat) {
    const typeName = def.asHistoricMetaCompat.toString();
    return registry.createType(typeName, constant.value, true);
  } else if (def.isPrimitive) {
    return registry.createType(def.asPrimitive.toString(), constant.value, true)
  } else if (def.isComposite) {
    return registry.createType(def.asComposite.fields.toJSON()[0].typeName, constant.value, true)
  }

  return null;
}

async function getMetadataConstByBlockHash(
  blockHash,
  moduleName,
  constantName
) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return getConstFromRegistry(registry.registry, moduleName, constantName);
}

async function getMetadataConstsByBlockHash(blockHash, constants) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return constants.map(({ moduleName, constantName }) =>
    getConstFromRegistry(registry.registry, moduleName, constantName)
  );
}

function getRealCaller(call, caller) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return call.args[0].toJSON();
  }

  if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
    // TODO:  Maybe other methods, check them out
  ) {
    const callHex = call.args[3];
    const innerCall = new GenericCall(call.registry, callHex);
    if (
      Modules.Proxy === innerCall.section &&
      ProxyMethods.proxy === innerCall.method
    ) {
      return innerCall.args[0].toJSON();
    }

    const threshold = call.args[0].toNumber();
    const otherSignatories = call.args[1].toJSON();
    return calcMultisigAddress(
      [caller, ...otherSignatories],
      threshold,
      call.registry.chainSS58
    );
  }

  return caller;
}

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

  if (Modules.Utility === section && UtilityMethods.batch === method) {
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
  getExtrinsicSigner,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  median,
  logger,
  incomeKnownHeightsLogger,
  bigAdd,
  gt,
  getMetadataConstByBlockHash,
  getMetadataConstsByBlockHash,
  getRealCaller,
  findTargetCall,
  findCallInSections,
  getConstFromRegistry,
};
