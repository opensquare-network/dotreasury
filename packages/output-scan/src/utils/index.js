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
  const pallets = registry.metadata.pallets;
  const pallet = pallets.find(p => p.name.toString() === moduleName);
  if (!pallet) {
    return null;
  }

  const constant = pallet.constants.find(c => c.name.toString() === constantName);
  const typeName = registry.lookup.types[constant.type.toNumber()].type.def.asHistoricMetaCompat.toString();
  return registry.createType(typeName, constant.value, true);
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
