function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex;
  });
}

function isExtrinsicSuccess(events) {
  return events.some((e) => e.event.method === "ExtrinsicSuccess");
}

function isHex(blockData) {
  if (typeof blockData !== "string") {
    return false;
  }

  return blockData.startsWith("0x");
}

function getConstFromRegistry(registry, moduleName, constantName) {
  const module = registry.metadata.modules.find(
    (m) => m.name.toString() === moduleName
  );
  if (!module) {
    return null;
  }

  const targetConst = module.constants.find(
    (c) => c.name.toString() === constantName
  );
  if (!targetConst) {
    return null;
  }

  const typeName = targetConst.type.toString();
  const Type = registry.get(typeName);
  return new Type(registry, targetConst.value);
}

function getConstsFromRegistry(registry, constants) {
  return constants.map(({ moduleName, constantName }) =>
    getConstFromRegistry(registry, moduleName, constantName)
  );
}

module.exports = {
  isHex,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  getConstFromRegistry,
  getConstsFromRegistry,
};
