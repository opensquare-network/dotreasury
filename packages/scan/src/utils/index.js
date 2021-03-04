const {
  logger,
  knownHeightsLogger,
  incomeLogger,
  incomeKnownHeightsLogger,
} = require("./logger");
const BigNumber = require("bignumber.js");
const { getApi } = require("../api");
const { TreasuryAccount } = require("./constants");
const { expandMetadata } = require("@polkadot/metadata");

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
    return await queryAccountFreeWithSystem(blockHash);
  } else {
    return await queryAccountFreeWithSystem(blockHash);
  }
}

module.exports = {
  getExtrinsicSigner,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  median,
  logger,
  knownHeightsLogger,
  incomeLogger,
  incomeKnownHeightsLogger,
  bigAdd,
  gt,
  getMetadataConstByBlockHash,
  getMetadataConstsByBlockHash,
  getTreasuryBalance,
};
