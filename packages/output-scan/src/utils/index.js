const BigNumber = require("bignumber.js");

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

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

module.exports = {
  isHex,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  bigAdd,
};
