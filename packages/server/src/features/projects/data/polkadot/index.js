const redspot = require("./redspot");
const dotreasury = require("../common/dotreasury");
const localCoinSwap = require("../common/localCoinSwap");
const elara = require("./elara");
const europa = require("./europa");
const zkmega = require("./zkmega");
const stylo = require("./stylo");
const polkaworld = require("./polkaworld");
const tee = require("./substrate-tee");

const projects = [
  dotreasury,
  localCoinSwap,
  redspot,
  elara,
  europa,
  zkmega,
  stylo,
  polkaworld,
  tee,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
