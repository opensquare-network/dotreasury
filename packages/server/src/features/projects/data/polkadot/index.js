const redspot = require("./redspot")
const dotreasury = require("../common/dotreasury")
const localCoinSwap = require("../common/localCoinSwap")

const projects = [
  dotreasury,
  localCoinSwap,
  redspot,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
