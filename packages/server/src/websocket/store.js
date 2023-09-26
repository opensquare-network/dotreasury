const data = {
  scanHeight: 0,
  overview: null,
  overviewV2: null,
};

function setScanHeight(height) {
  data.scanHeight = height;
}

function getScanHeight() {
  return data.scanHeight;
}

function setOverview(arg) {
  data.overview = arg;
}

function getOverview() {
  return data.overview;
}

function setOverviewV2(arg) {
  data.overviewV2 = arg;
}

function getOverviewV2() {
  return data.overviewV2;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
  setOverviewV2,
  getOverviewV2,
};
