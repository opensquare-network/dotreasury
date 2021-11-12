const BigNumber = require("bignumber.js");

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
  bigAdd,
  bigAdds,
  gt,
}
