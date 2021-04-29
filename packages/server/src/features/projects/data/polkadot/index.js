const redspot = require("./redspot")
const dotreasury = require("../common/dotreasury")

const projects = [
  dotreasury,
  redspot,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
