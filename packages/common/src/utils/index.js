const BigNumber = require("bignumber.js");
const sleep = require("./sleep");
const memory = require("./memory");

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

function bigAdds(values = []) {
  return values.reduce((result, v) => {
    return bigAdd(result, v)
  }, '0')
}

function gt(v1, v2) {
  return new BigNumber(v1).isGreaterThan(v2);
}

module.exports = {
  ...sleep,
  ...memory,
  extractExtrinsicEvents,
  isExtrinsicSuccess,
  isHex,
  bigAdd,
  bigAdds,
  gt,
}
