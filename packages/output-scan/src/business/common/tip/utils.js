const { findBlockApi } = require("../../../chain/specs/blockApi");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../constants");
const { GenericCall } = require("@polkadot/types");
const { blake2AsHex } = require("@polkadot/util-crypto");
const { isHex, hexToString } = require("@polkadot/util");

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

  const maybeTxt = rawMeta.toHuman();
  if (isHex(maybeTxt)) {
    return hexToString(maybeTxt);
  } else {
    return maybeTxt;
  }
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

async function getTippersCountFromApi(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.consts.electionsPhragmen?.desiredMembers) {
    return blockApi.consts.electionsPhragmen?.desiredMembers.toNumber()
  } else if (blockApi.consts.phragmenElection?.desiredMembers) {
    return blockApi.consts.phragmenElection?.desiredMembers.toNumber()
  }

  throw new Error("can not get elections desired members");
}

async function getTipFindersFeeFromApi(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.consts.tips?.tipFindersFee) {
    return blockApi.consts.tips?.tipFindersFee.toNumber()
  } else if (blockApi.consts.treasury?.tipFindersFee) {
    return blockApi.consts.treasury?.tipFindersFee.toNumber()
  }

  return null;
}

module.exports = {
  getNewTipCall,
  getTipFindersFeeFromApi,
  getTipMetaFromStorage,
  getTipReason,
  getTippersCountFromApi,
};
