const data = {
  kusama: {
    scanHeight: 0,
    overview: null,
    overviewV2: null,
  },
  polkadot: {
    scanHeight: 0,
    overview: null,
    overviewV2: null,
  },
};

function setScanHeight(chain, height) {
  data[chain].scanHeight = height;
}

function getScanHeight(chain) {
  return data[chain]?.scanHeight;
}

function setOverview(chain, arg) {
  data[chain].overview = arg;
}

function getOverview(chain) {
  return data[chain]?.overview;
}

function setOverviewV2(chain, arg) {
  data[chain].overviewV2 = arg;
}

function getOverviewV2(chain) {
  return data[chain]?.overviewV2;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
  setOverviewV2,
  getOverviewV2,
};
