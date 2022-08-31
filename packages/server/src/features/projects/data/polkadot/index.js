const redspot = require("./redspot");
const dotreasury = require("../common/dotreasury");
const localCoinSwap = require("../common/localCoinSwap");
const elara = require("./elara");
const europa = require("./europa");
const zkmega = require("./zkmega");
const stylo = require("./stylo");
const tee = require("./substrate-tee");
const polkascan = require("../common/polkascan");
const onfinality = require("../common/onFinality");
const polkastats = require("../common/polkaStats");
const peri = require("../polkadot/peri");
const subscan = require("../common/subscan");
const polkassembly = require("../common/polkassembly");
const polkaworld = require("./polkaworld");
const dwellir = require("../common/dwellir");
const decoded2022 = require("../common/decoded-2022");
const brightTreasury = require("../common/brightTreasury");

const projects = [
  polkaworld,
  polkassembly,
  subscan,
  peri,
  polkastats,
  onfinality,
  polkascan,
  dotreasury,
  localCoinSwap,
  redspot,
  elara,
  europa,
  zkmega,
  stylo,
  tee,
  dwellir,
  decoded2022,
  brightTreasury,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
