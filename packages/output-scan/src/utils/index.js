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

module.exports = {
  isHex,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
};
