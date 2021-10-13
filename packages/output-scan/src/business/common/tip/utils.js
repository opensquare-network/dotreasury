const { findBlockApi } = require("../../../chain/specs/blockApi");
const { getConstsFromRegistry } = require("../../../utils");
const { getConstFromRegistry } = require("../../../utils");
const { getApi } = require("../../../api");
const { findDecorated } = require("../../../chain/specs");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../constants");
const { GenericCall } = require("@polkadot/types");
const { blake2AsHex } = require("@polkadot/util-crypto");

async function getTipMetaFromStorage(blockHash, tipHash) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.tips) {
    rawMeta = await blockApi.query.treasury?.tips(tipHash);
  } else {
    rawMeta = await blockApi.query.tips.tips(tipHash);
  }

  return rawMeta.toJSON();
}

async function getTipReason(blockHash, reasonHash) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.reasons) {
    rawMeta = await blockApi.query.treasury?.reasons(reasonHash);
  } else {
    rawMeta = await blockApi.query.tips.reasons(reasonHash);
  }
  return rawMeta.toHuman();
}

function findNewTipCallFromProxy(registry, proxyCall, reasonHash) {
  const [, , innerCall] = proxyCall.args;
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromMulti(registry, call, reasonHash) {
  const callHex = call.args[3];
  const innerCall = new GenericCall(registry, callHex);
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromBatch(registry, call, reasonHash) {
  for (const innerCall of call.args[0]) {
    const call = getNewTipCall(registry, innerCall, reasonHash);
    if (call) {
      return call;
    }
  }

  return null;
}

function getNewTipCall(registry, call, reasonHash) {
  const { section, method, args } = call;
  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return findNewTipCallFromProxy(registry, call, reasonHash);
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === method) {
    return findNewTipCallFromMulti(registry, call, reasonHash);
  }

  if (Modules.Utility === section && UtilityMethods.batch === method) {
    return findNewTipCallFromBatch(registry, call, reasonHash);
  }

  if (
    [Modules.Treasury, Modules.Tips].includes(section) &&
    [TipMethods.tipNew, TipMethods.reportAwesome].includes(method)
  ) {
    const hash = blake2AsHex(args[0]);
    if (hash === reasonHash) {
      return call;
    }
  }

  return null;
}

function getTippersCount(registry) {
  const oldModuleValue = getConstFromRegistry(
    registry,
    "ElectionsPhragmen",
    "DesiredMembers"
  );

  if (oldModuleValue) {
    return oldModuleValue.toNumber();
  }

  const newModuleValue = getConstFromRegistry(
    registry,
    "PhragmenElection",
    "DesiredMembers"
  );

  return newModuleValue ? newModuleValue.toNumber() : newModuleValue;
}

function getTipFindersFee(registry) {
  const constants = getConstsFromRegistry(registry, [
    {
      moduleName: "Tips",
      constantName: "TipFindersFee",
    },
    {
      moduleName: "Treasury",
      constantName: "TipFindersFee",
    },
  ]);

  return (constants[0] ?? constants[1])?.toJSON();
}

module.exports = {
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
  getTipMetaFromStorage,
  getTipReason,
};
