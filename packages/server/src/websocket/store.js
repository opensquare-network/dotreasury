let scanHeight = 0;
let overview = null;

function setScanHeight(height) {
  scanHeight = height;
}

function getScanHeight() {
  return scanHeight;
}

function setOverview(arg) {
  overview = arg;
}

function getOverview() {
  return overview;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
};
