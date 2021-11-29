const data = {
  kusama: {
    scanHeight: 0,
    overview: null,
  },
  polkadot: {
    scanHeight: 0,
    overview: null,
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

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
};
