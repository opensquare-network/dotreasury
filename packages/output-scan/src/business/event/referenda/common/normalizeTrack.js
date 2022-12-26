const BigNumber = require("bignumber.js");

function normalize(track = {}) {
  return Object.entries(track).reduce((result, [name, value]) => {
    if (name === "decisionDeposit") {
      result[name] = new BigNumber(value).toString();
    } else if (name === "name") {
      result[name] = (value || "").toLowerCase().split(" ").join("_");
    } else {
      result[name] = value;
    }

    return result;
  }, {})
}

module.exports = {
  normalizeTrack: normalize,
}
