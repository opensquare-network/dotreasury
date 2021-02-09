const { logger, knownHeightsLogger, incomeLogger } = require("./logger");
const BigNumber = require("bignumber.js");

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

module.exports = {
  getExtrinsicSigner,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  median,
  logger,
  knownHeightsLogger,
  incomeLogger,
  bigAdd,
};
