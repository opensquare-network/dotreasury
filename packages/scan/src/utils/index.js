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

function computeTipValue(tips) {
  if (!tips || !tips.length) {
    return null;
  }

  tips = tips.slice();
  tips.sort((a, b) => a[1] - b[1]);
  return tips[Math.floor(tips.length / 2)][1];
}

module.exports = {
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  sleep,
  computeTipValue,
};
