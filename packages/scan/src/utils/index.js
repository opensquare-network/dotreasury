const { logger, incomeKnownHeightsLogger } = require("./logger");
const BigNumber = require("bignumber.js");
const { calcMultisigAddress } = require("./call");
const { getApi } = require("../api");
const {
  TreasuryAccount,
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
} = require("./constants");
const { currentChain } = require("../chain");
const { GenericCall, expandMetadata } = require("@polkadot/types");

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
  let iterVersion = 0;
  const metadata = registry.metadata.get("metadata");

  while (iterVersion < 1000) {
    if (!metadata[`isV${iterVersion}`]) {
      iterVersion++;
      continue;
    }

    const modules = metadata[`asV${iterVersion}`].get("modules");
    const targetModule = modules.find(
      (module) => module.name.toString() === moduleName
    );
    if (!targetModule) {
      // TODO: should throw error
      break;
    }

    const targetConstant = targetModule.constants.find(
      (constant) => constant.name.toString() === constantName
    );
    if (!targetConstant) {
      break;
    }

    const typeName = targetConstant.type.toString();
    const Type = registry.registry.get(typeName);
    return new Type(registry.registry, targetConstant.value);
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
  return getConstFromRegistry(registry, moduleName, constantName);
}

async function getMetadataConstsByBlockHash(blockHash, constants) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return constants.map(({ moduleName, constantName }) =>
    getConstFromRegistry(registry, moduleName, constantName)
  );
}

const ksmMigrateAccountHeight = 1492896;
let oldKey;

async function queryAccountFreeWithSystem(blockHash) {
  const api = await getApi();
  const account = (
    await api.query.system.account.at(blockHash, TreasuryAccount)
  ).toJSON();
  return account?.data?.free;
}

async function setOldKey() {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(1375085);
  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);

  oldKey = [decorated.query.balances.freeBalance, TreasuryAccount];
}

async function getTreasuryBalance(blockHash, blockHeight) {
  const api = await getApi();
  if ("polkadot" === currentChain()) {
    // TODO: We can not get treasury balance at height which <= 29230.
    // TODO: Though we do not store the balance in this range, we should figure out how to query it.
    if (blockHeight <= 29230) {
      return 0;
    }

    return await queryAccountFreeWithSystem(blockHash);
  }

  if (blockHeight < 1375086) {
    const metadata = await api.rpc.state.getMetadata(blockHash);
    const decorated = expandMetadata(metadata.registry, metadata);
    const key = [decorated.query.balances.freeBalance, TreasuryAccount];
    const value = await api.rpc.state.getStorage(key, blockHash);

    if (blockHeight === 1375085) {
      oldKey = key;
    }

    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < 1377831) {
    if (!oldKey) {
      await setOldKey();
    }
    const value = await api.rpc.state.getStorage(oldKey, blockHash);

    const metadata = await api.rpc.state.getMetadata(blockHash);
    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < ksmMigrateAccountHeight) {
    // TODO: find how to get the balance from 1377831 to 1492896
    return null;
    // return await queryAccountFreeWithSystem(blockHash);
  } else {
    return await queryAccountFreeWithSystem(blockHash);
  }
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
  getTreasuryBalance,
  getRealCaller,
  findTargetCall,
  findCallInSections,
};
