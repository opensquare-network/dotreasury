const { logger, knownHeightsLogger } = require("./logger");
const { getApi } = require("../api");

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

module.exports = {
  getExtrinsicSigner,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  median,
  logger,
  knownHeightsLogger,
  getMetadataConstByBlockHash,
  getMetadataConstsByBlockHash,
};
