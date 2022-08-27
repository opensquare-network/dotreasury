const dotreasury = require("./dotreasury");
const dwellir = require("./dwellir");
const localCoinSwap = require("./localCoinSwap");
const onFinality = require("./onFinality");
const patractLabs = require("./patractLabs");
const polkascan = require("./polkascan");
const polkashotsIo = require("./polkashotsIo");
const polkassembly = require("./polkassembly");
const polkaStats = require("./polkaStats");
const subscan = require("./subscan");

const commonProjects = {
  dotreasury,
  dwellir,
  localCoinSwap,
  onFinality,
  patractLabs,
  polkascan,
  polkashotsIo,
  polkassembly,
  polkaStats,
  subscan,
}

module.exports = {
  commonProjects,
}
